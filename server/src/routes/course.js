const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course");
const authenticateWithJwt = require("../middleware/authenticateWithJwt");
const isAdmin = require("../middleware/isAdmin");

router.route("/") 
    .get(courseController.list)
    .post(authenticateWithJwt, isAdmin,courseController.create); //admin only

router.route("/:id")
    .get(courseController.detail)
    .put(authenticateWithJwt, isAdmin,courseController.update) //adimin only
    .delete(authenticateWithJwt, isAdmin,courseController.delete) //admin only

module.exports = router;