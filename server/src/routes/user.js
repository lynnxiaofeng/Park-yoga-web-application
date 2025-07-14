const express = require("express");
const controller = require("../controllers/user");
const authenticateWithJwt = require("../middleware/authenticateWithJwt")
const router = express.Router();
const isAdmin = require("../middleware/isAdmin");


//Get all
router.get("/",authenticateWithJwt,isAdmin,controller.listAllUser);
//Create register
router.post("/register", controller.register);
//log in 
router.post("/login", controller.login);
//Get by ID, only logined user can read their own profile
router.get("/:id",authenticateWithJwt,controller.userDetail)
//Update, only login user can update their information
router.put("/:id",authenticateWithJwt,controller.updateUser);
//Delete, login user can choose to delete their profile.
router.delete("/:id",authenticateWithJwt,controller.deleteUser);

module.exports = router;