const express = require("express");

const router = express.Router();
const courseRouter = require("./course");
const userRouter = require("./user");
const bookingRouter = require("./booking");

router.use('/courses', courseRouter);
router.use('/users', userRouter);
router.use('/bookings', bookingRouter);

router.get("/", (req, res) => {
    res.json({message: "Welcome to the yoga course API"} );
});

module.exports = router;