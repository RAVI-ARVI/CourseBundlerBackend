import express from "express";
import {
  createCourse,
  getAllCourses,
} from "../Controllers/courseController.js";

const router = express.Router();

//get all courses with out lectures

router.route("/courses").get(getAllCourses);

//create new course only admin
router.route("/courses").post(createCourse);

// Add lecture , delete lecture , get course details, delete coures

export default router;
