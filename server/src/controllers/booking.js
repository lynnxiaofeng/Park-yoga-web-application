const Booking = require("../models/booking");
const Course = require ("../models/course");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Inline validator for booking creation
const bookingValidator = () => [
  body("bookingCourse")
    .notEmpty().withMessage("Course must be specified")
    .matches(/^[0-9a-fA-F]{24}$/).withMessage("Invalid course ID"),
  body("status")
    .optional()
    .isIn(["Confirmed", "Pending"])
    .withMessage("Status must be 'Confirmed' or 'Pending'"),
];

// List all bookings from logged in user
exports.list =  asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: No user ID found in token" });
  }

  const bookings = await Booking.find({ bookingStudent: userId })
    .populate({ path: "bookingCourse", select: "name time location.suburb location.link" })
    .exec();
  if (!bookings) {
      return res.status(404).json({ message: "Booking not found" });
    }
  return res.status(200).json(bookings);
});

// get booking by bookingId, only if logged in user owns it
exports.detail = asyncHandler(async (req, res) => {
  const bookingId = req.params.id; // From URL
  const userId = req.user?._id; // From token

  if (!bookingId) {
    return res.status(400).json({ message: "Booking ID is required." });
  }

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: User not logged in." });
  }

  const booking = await Booking.findOne({ _id: bookingId, bookingStudent: userId })
    .populate({ path: "bookingCourse", select: "name time location.suburb location.link" })
    .populate({ path: "bookingStudent", select: "username" })
    .exec();

  if (!booking) {
    return res.status(404).json({ message: "Booking not found or you do not have access." });
  }

  return res.status(200).json(booking);
});


//Create booking by user, if they login
exports.createBooking = [
  bookingValidator(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    // Early return if validation failed
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { bookingCourse, status } = req.body;
    const bookingStudent = req.user?._id;
    if (!bookingStudent) {
      return res.status(401).json({ error: "Unauthorized: No user ID found in token" });
    }
    // ✅ Check if Course exists
    const course = await Course.findById(bookingCourse);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

   // ✅ Create and save the booking
   const booking = new Booking({
    bookingCourse,
    bookingStudent,
    status: status || "Pending",
  });

    await booking.save();

    await booking.populate([
      { path: "bookingCourse", select: "name time location.suburb location.link" },
      { path: "bookingStudent", select: "username" }
    ]);

    res.status(200).json(booking);
  }),
];


//user login and update their booking status, only update booking status and booking course.status, can not update the student
// Update booking status (only status allowed), only by the booking's owner
exports.update = [
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(["Confirmed", "Pending"]).withMessage("Status must be 'Confirmed' or 'Pending'"),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const bookingStudent = req.user?._id;

    if (!bookingStudent) {
      return res.status(401).json({ error: "Unauthorized: No user ID found in token" });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Ensure the user owns this booking
    if (booking.bookingStudent.toString() !== bookingStudent.toString()) {
      return res.status(403).json({ error: "You are not authorized to update this booking." });
    }

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // ✅ Only update status
    booking.status = req.body.status;

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate({
        path: "bookingCourse",
        select: "name time location.suburb location.link"
      })
      .populate({
        path: "bookingStudent",
        select: "username"
      });

    return res.status(200).json(updatedBooking);
  }),
];


//delete booking, admin only
exports.delete = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id).exec();

  if (booking == null) {
    // No booking found
    return res.status(404).json({ error: 'Booking not found' });
  } else {
    // Delete object and respond with success.
    await Booking.findByIdAndDelete(req.params.id);
    return res.status(200).send();
  }
});