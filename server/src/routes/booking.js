const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking");
const authenticateWithJwt = require("../middleware/authenticateWithJwt");
const isAdmin = require("../middleware/isAdmin");
const bookingLimiter = require('../middleware/bookingLimiter');

router.route("/") 
    .get(authenticateWithJwt,bookingController.list) //get all bookings logged in user
    .post(authenticateWithJwt,bookingLimiter, bookingController.createBooking) //user log in and create booking,limit to create too many course

router.route("/:id")
    .get(authenticateWithJwt,bookingController.detail) //user login and see their bookings
    .put(authenticateWithJwt,bookingLimiter,bookingController.update) //user login and update their booking status, limit to update the booking status
    .delete(authenticateWithJwt,isAdmin,bookingController.delete) //delete booking, admin only

module.exports = router;