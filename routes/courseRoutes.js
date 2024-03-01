import express from "express";
import {
  addCourseLectures,
  createCourse,
  deleteCourse,
  deleteLectures,
  getAllCourses,
  getCourseLectures,
} from "../Controllers/courseController.js";
import { isAutharaizedAdmin, isAuthenticated } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

//get all courses with out lectures

router.route("/courses").get(getAllCourses);

//create new course only admin
router
  .route("/courses")
  .post(isAuthenticated, isAutharaizedAdmin, singleUpload, createCourse);

// Add lecture , delete lecture , get course details, delete coures

router
  .route("/course/:id")
  .get(getCourseLectures)
  .post(isAuthenticated, isAutharaizedAdmin, singleUpload, addCourseLectures)
  .delete(isAuthenticated, isAutharaizedAdmin, deleteCourse);

router
  .route("/lecture")
  .delete(isAuthenticated, isAutharaizedAdmin, deleteLectures);

export default router;
