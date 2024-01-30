import express from "express";
import {
  changeMyPassword,
  getMyProfile,
  login,
  logout,
  register,
  updateProfile,
  updateProfilePicture,
} from "../Controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

//register new user

router.route("/register").post(register);

//login user
router.route("/login").post(login);

//logout user

router.route("/logout").get(logout);

router.route("/myprofile").get(isAuthenticated, getMyProfile);
router.route("/changepassword").put(isAuthenticated, changeMyPassword);
router.route("/updateprofile").put(isAuthenticated, updateProfile);
router
  .route("/updateprofilepicture")
  .put(isAuthenticated, updateProfilePicture);

//get my profile

// change password

//update profile

//update profile picture

//forgot password
//reset password

//add to playlist

//remove form playlist

export default router;
