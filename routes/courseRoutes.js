import express from "express";
import {
  addCourseLectures,
  createCourse,
  getAllCourses,
  getCourseLectures,
} from "../Controllers/courseController.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

//get all courses with out lectures

router.route("/courses").get(getAllCourses);

//create new course only admin
router.route("/courses").post(singleUpload, createCourse);

// Add lecture , delete lecture , get course details, delete coures

router
  .route("/course/:id")
  .get(getCourseLectures)
  .post(singleUpload, addCourseLectures);

export default router;
