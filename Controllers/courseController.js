import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import { Course } from "../models/Course.js";
import ErrorHandler from "../utills/errorHandler.js";

export const getAllCourses = catchAsyncError(async (req, res, next) => {
  const courses = await Course.find();

  // res.send("working");
  res.status(200).json({
    success: true,
    courses,
  });
});

export const createCourse = catchAsyncError(async (req, res, next) => {
  console.log(req.body);
  const { title, description, category, createdBy } = req.body;

  if (!title || !description || !category || !createdBy)
    return next(new ErrorHandler("Please add all fields ", 400));

  // const file = req.file;
  const createdCourse = await Course.create({
    title,
    description,
    category,
    createdBy,
    poster: {
      public_id: "temp",
      url: "temp",
    },
  });

  res.status(201).json({
    success: true,
    message: "Course Created Successfully",
    createdCourse,
  });
});
