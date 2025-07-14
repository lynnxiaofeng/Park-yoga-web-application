const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        suburb: { type: String, required: true },
        park: { type: String, required: true },
        link: { type: String, required: true }
    },    
    description: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    teacher:{ 
        type: Schema.ObjectId, 
        ref: "User"
    }
});

module.exports = mongoose.model("Course", courseSchema);