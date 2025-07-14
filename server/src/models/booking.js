const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    bookingCourse: { type: Schema.ObjectId, ref: "Course", required: true }, // Reference to the associated course.
    bookingStudent:{ type: Schema.ObjectId, ref: "User", required: true },// Reference to the associated user.
    status: {
      type: String,
      required: true,
      enum: ["Confirmed", "Pending"],
      default: "Pending"
    }
  });
  
module.exports = mongoose.model('Booking',bookingSchema);
