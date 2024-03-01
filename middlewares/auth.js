import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import ErrorHandler from "../utills/errorHandler.js";
import { catchAsyncError } from "./catchAsyncErrors.js";
export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) next(new ErrorHandler("User not authenticated", 401));
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded._id);
  next();
});

export const isAutharaizedAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(
      new ErrorHandler(
        `${req.user.role} is not allowed to access this resource`
      )
    );
  }
  next();
};
