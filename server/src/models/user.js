const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true,
    },
    is_admin: {
        type: Boolean,
        required: true,
        default: false
    }
});

// Hash password before saving
userSchema.pre("save", { document: true, query: false }, async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

//hash password before saving
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);