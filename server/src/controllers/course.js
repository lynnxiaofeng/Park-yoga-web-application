const Course = require("../models/course");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const { body, query, validationResult } = require("express-validator");
//validate the course creat
const courseValidator = () => {
    return [
      body("name")
        .notEmpty().withMessage("Course name is required")
        .isString().withMessage("Course name must be a string"),
  
      body("location.suburb")
        .notEmpty().withMessage("Suburb is required")
        .isString().withMessage("Suburb must be a string"),
  
      body("location.park")
        .notEmpty().withMessage("Park name is required")
        .isString().withMessage("Park name must be a string"),
  
      body("location.link")
        .notEmpty().withMessage("Location link is required")
        .isURL().withMessage("Location link must be a valid URL"),
  
      body("description")
        .notEmpty().withMessage("Description is required")
        .isString().withMessage("Description must be a string"),
  
      body("time")
        .notEmpty().withMessage("Time is required")
        .isString().withMessage("Time must be a string"),
  
      body("teacher")
        .optional()
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage("Teacher must be a valid user ID"),
    ];
  };

//list all courses, query and filter is applied by suburb
exports.list = [
  query('location.suburb').optional().trim(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const filter = {};
    if (req.query['location.suburb']) {
      filter['location.suburb'] = req.query['location.suburb'];
    }

    const allCourses = await Course.find(filter)
      .sort({ "time": 1 })
      .populate({path: "teacher", select: "username" })
      .exec();

    res.json(allCourses);
  })
];


//list course by id
exports.detail = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id).exec();

    if (course ==null) {
        res.status(204).json({ error: "Course not found" });
    }
    res.json(course);
});

//create course, admin only
exports.create = [
  courseValidator(),
  asyncHandler(async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      const { name, description, location, time, teacher } = req.body;

      // Ensure the location object is fully populated
      if (!location || !location.suburb || !location.park || !location.link) {
          return res.status(400).json({ error: "All location fields (suburb, park, link) are required" });
      }

      const course = new Course({
          name,
          description,
          location,
          time,
          teacher
      });

      await course.save();
      res.status(201).json(course);
  })
];


//update course, admin only
exports.update = [
    courseValidator(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check if the Course exists
        const course = await Course.findById({ _id: req.params.id });
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const updatedCourse = await Course.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    name: req.body.name,
                    description: req.body.description,
                    location: req.body.location,
                    time: req.body.time
                    },
            },
            { new: true, runValidators: true } // `new: true` returns the updated document
        );
        return res.status(200).json({
          message: "Course updated",
          course: updatedCourse
        });
    }),
];

//delete course, admin only
exports.delete = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  await course.deleteOne(); // OR Course.findByIdAndDelete(req.params.id)
  res.status(200).json({ message: 'Course deleted successfully' });
});
