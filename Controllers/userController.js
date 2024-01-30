import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utills/errorHandler.js";
import { sendToken } from "../utills/sendToken.js";

export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please Enter All Fields", 400));
  }

  //   const file= req.file
  let user = await User.findOne({ email: email });

  if (user) {
    return next(new ErrorHandler("User already exists", 409));
  }

  //uploading file to cluodnary

  user = await User.create({
    name: name,
    email: email,
    password: password,
    avatar: {
      public_id: "temp",
      url: "temp",
    },
  });

  sendToken(res, user, "user registered successfully", 201);
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password, "this is user details");
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
  // Need to add Multer : ToDo

  return res.status(201).json({
    success: true,
    message: "Profile Picture will  Update soon",
  });
});
