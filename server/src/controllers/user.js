const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");

//Create a user, register
exports.register = asyncHandler(async (req, res) => {
    const { username, email, password, is_admin } = req.body;

    // Check if email is already taken
    const existingUser = await User.findOne({ email });
    const notUniqueName = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ error: "email is already registered" });
    }
    else if(notUniqueName){
        return res.status(400).json({ error: "Username is already taken" });
    }
    const user = new User({ username, email, password, is_admin });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
});

//user login
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log("JWT SECRET:", process.env.JWT_SECRET); // 🔥 Debugging line
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ _id: user._id, user_name: user.username,is_admin: user.is_admin }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({
      token,
      user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          is_admin: user.is_admin,
      }
  });
});

//get all users
exports.listAllUser = asyncHandler(async(req,res)=>{
    const allUsers = await User.find({});  // Find all users from the User model
    res.json(allUsers);  // Return the list of users as JSON response
})

//ger user by ID
exports.userDetail = asyncHandler(async(req,res)=>{
    const username = req.params.id;
    const user = await User.findOne({username});
    if(!user){
        return res.status(204).json({ message: "User not found" });
    }
    return res.json(user);    
})

//update user details by id, only update email and status. username is not allowed to update
exports.updateUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Step 1: Ensure the logged-in user matches the route param
  if (req.user.user_name !== req.params.id) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  // Step 2: Check if the new email already exists (for another user)
  if (email) {
    const existingEmail = await User.findOne({ email });
    if (existingEmail && existingEmail.username !== req.user.user_name) {
      return res.status(400).json({ error: "Email already exists" });
    }
  }

    // Step 3: Update the user info
    const updatedUser = await User.findOneAndUpdate(
      { username: req.params.id },
      { email, password }, // You may want to hash the password before saving!
      { new: true }
    );

  res.status(200).json(updatedUser);
});
  

//delete by user id, here the :id should indicate to username
exports.deleteUser = asyncHandler(async (req, res) => {
    const username = req.params.id; // Username passed as param
  
    const user = await User.findOne({ username });
  
    if (!user) {
      return res.status(204).json({ message: "User not found" });
    }
  
    await User.deleteOne({ _id: user._id });
  
    return res.status(200).json({
      message: "200 OK, User is successfully deleted",
    });
  });
  