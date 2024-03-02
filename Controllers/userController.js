import crypto from "crypto";
import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/User.js";

import cloudinary from "cloudinary";
import { Course } from "../models/Course.js";
import getDataUri from "../utills/dataUri.js";
import ErrorHandler from "../utills/errorHandler.js";
import { sendEmail } from "../utills/sendEmail.js";
import { sendToken } from "../utills/sendToken.js";

export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const file = req.file;

  if (!name || !email || !password || !file) {
    return next(new ErrorHandler("Please Enter All Fields", 400));
  }

  let user = await User.findOne({ email: email });

  if (user) {
    return next(new ErrorHandler("User already exists", 409));
  }

  //uploading file to cluodnary

  const filuri = getDataUri(file);

  const mycloud = await cloudinary.v2.uploader.upload(filuri.content);

  user = await User.create({
    name: name,
    email: email,
    password: password,
    avatar: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
  });

  sendToken(res, user, "user registered successfully", 201);
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter All Fields", 400));
  }

  //   const file= req.file
  let user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("User Not Found With This Email", 401));
  }

  //uploading file to cluodnary

  const isPasswordMatch = await user.comparePassword(password);
  console.log(isPasswordMatch, "this is password match");

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  sendToken(res, user, "user Login successfully", 200);
});

export const logout = catchAsyncError(async (req, res, next) => {
  const options = {
    expires: new Date(Date.now()),
  };
  return res.status(200).cookie("token", null, options).json({
    success: true,
    message: "Logout successfully",
  });
});

export const getMyProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  return res.status(200).json({
    success: true,
    user,
  });
});

export const changeMyPassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return next(new ErrorHandler("Please Enter All Fields", 400));
  }

  const user = await User.findById(req.user._id).select("+password");

  const validatePassword = await user.comparePassword(oldPassword);
  if (!validatePassword) {
    return next(new ErrorHandler("Invalidate Password", 401));
  }

  user.password = newPassword;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

export const updateProfile = catchAsyncError(async (req, res, next) => {
  const { name, email } = req.body;

  const user = await User.findById(req.user._id);

  if (name) {
    user.name = name;
  }

  if (email) {
    user.email = email;
  }

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Profile Updated successfully",
    user,
  });
});

export const updateProfilePicture = catchAsyncError(async (req, res, next) => {
  const file = req.file;

  const user = await User.findById(req.user._id);

  const filuri = getDataUri(file);
  const mycloud = await cloudinary.v2.uploader.upload(filuri.content);

  await cloudinary.v2.uploader.destroy(user.avatar.public_id);
  user.avatar = {
    public_id: mycloud.public_id,
    url: mycloud.secure_url,
  };
  await user.save();

  return res.status(201).json({
    success: true,
    message: "Profile Picture Updated SuccessFully   ",
  });
});

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email });
  if (!user) next(new ErrorHandler("User not found with this Email Id", 400));

  const resetToken = await user.generateToken();
  await user.save();

  const url = `${process.env.FRONTEND_URL}/token/${resetToken}`;
  const message = `Click the link to reset your password. ${url}. If you have not request then please ignore`;

  sendEmail(user.email, "CourseBundler Reset Password ", message);

  // send token to email

  return res.status(200).json({
    success: true,
    message: `Reset Token has been sent to ${user.email}`,
  });
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  // Need to add Multer : ToDo
  const { token } = req.params;

  const resetPasswordToken = await crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return next(new ErrorHandler("User Token Expired", 404));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return res.status(201).json({
    success: true,
    message: "User Password updated Successfully",
  });
});

export const addToPlaylist = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const course = await Course.findById(req.body.id);

  if (!course) {
    next(new ErrorHandler("Course not Found", 404));
  }
  const isExistingCourse = user.playlist.find((item) => {
    if (item.course.toString() == course._id.toString()) return true;
  });

  if (isExistingCourse) {
    next(new ErrorHandler("Item Already Exists", 409));
  }
  user.playlist.push({
    course: course._id,
    poster: course.poster.url,
  });
  await user.save();

  return res.status(201).json({
    success: true,
    message: `Added To PlayList`,
  });
});

export const removeFromPlaylist = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const course = await Course.findById(req.query.id);

  if (!course) {
    next(new ErrorHandler("Course not Found", 404));
  }
  const nexPlaylist = user.playlist.filter((item) => {
    if (item.course.toString() !== course._id.toString()) {
      return item;
    }
  });
  user.playlist = nexPlaylist;

  await user.save();

  return res.status(200).json({
    success: true,
    message: `Removed To PlayList`,
  });
});

export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  return res.status(200).json({
    success: true,
    usersCount: users.length,
    users,
  });
});

export const updateUserRole = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    next(new ErrorHandler("User not Found", 404));
  }

  if (user.role == "user") {
    user.role = "admin";
  } else {
    user.role = "user";
  }
  await user.save();

  return res.status(200).json({
    success: true,
    message: "User Role Updated Successfully",
  });
});

export const deleteUserRole = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    next(new ErrorHandler("User not Found", 404));
  }

  await cloudinary.v2.uploader.destroy(user.avatar.public_id);

  await user.deleteOne();

  return res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});

export const deleteMe = catchAsyncError(async (req, res, next) => {
  console.log(req.user);
  const user = await User.findById(req.user._id);

  await cloudinary.v2.uploader.destroy(user.avatar.public_id);

  await user.deleteOne();
  const options = {
    expires: new Date(Date.now()),
  };

  return res.cookie("token", null, options).status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
