import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import { Course } from "../models/Course.js";
import getDataUri from "../utills/dataUri.js";
import ErrorHandler from "../utills/errorHandler.js";

import cloudinary from "cloudinary";

export const getAllCourses = catchAsyncError(async (req, res, next) => {
  const courses = await Course.find();

  // res.send("working");
  res.status(200).json({
    success: true,
    courses,
  });
});

export const createCourse = catchAsyncError(async (req, res, next) => {
  const { title, description, category, createdBy } = req.body;

  if (!title || !description || !category || !createdBy)
    return next(new ErrorHandler("Please add all fields ", 400));

  const file = req.file;

  const filuri = getDataUri(file);

  const mycloud = await cloudinary.v2.uploader.upload(filuri.content);

  const createdCourse = await Course.create({
    title,
    description,
    category,
    createdBy,
    poster: {
      public_id: mycloud.public_id,
      url: mycloud.url,
    },
  });

  res.status(201).json({
    success: true,
    message: "Course Created Successfully",
    createdCourse,
  });
});

export const deleteCourse = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const course = await Course.findById(id);

  if (!course) {
    return next(new ErrorHandler("Course not Found", 404));
  }

  await cloudinary.v2.uploader.destroy(course.poster.public_id);

  for (let i = 0; i < course.lectures.length; i++) {
    const singlelecture = course.lectures[i];

    await cloudinary.v2.uploader.destroy(singlelecture.video.public_id, {
      resource_type: "video",
    });
  }
  await course.deleteOne();
  res.status(200).json({
    success: true,
    message: "Course Deleted Successfully",
  });
});

export const getCourseLectures = catchAsyncError(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorHandler("Course not Found", 404));
  }

  course.viwes += 1;
  await course.save();

  // res.send("working");
  res.status(200).json({
    success: true,
    lectures: course.lectures,
  });
});

export const addCourseLectures = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const course = await Course.findById(id);

  if (!course) {
    return next(new ErrorHandler("Course not Found", 404));
  }
  //max size is 100mb
  const file = req.file;

  const filuri = getDataUri(file);

  const mycloud = await cloudinary.v2.uploader.upload(filuri.content, {
    resource_type: "video",
  });

  course.lectures.push({
    title,
    description,
    video: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
  });
  course.numOfvideos = course.lectures.length;
  await course.save();

  // res.send("working");
  res.status(200).json({
    success: true,
    message: "Lectures added successfully",
  });
});

//delete lectures

export const deleteLectures = catchAsyncError(async (req, res, next) => {
  const { courseId, lectureId } = req.query;

  const course = await Course.findById(courseId);

  if (!course) {
    return next(new ErrorHandler("Course not Found", 404));
  }

  const lecture = course.lectures.find(
    (item) => item._id.toString() == lectureId.toString()
  );
  await cloudinary.v2.uploader.destroy(lecture.video.public_id, {
    resource_type: "video",
  });
  course.lectures = course.lectures.filter(
    (lecture) => lecture._id.toString() !== lectureId.toString()
  );
  course.numOfvideos = course.lectures.length;
  await course.save();
  res.status(200).json({
    success: true,
    message: "Lectures Deleted successfully",
  });
});
