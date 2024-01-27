import express from "express";
import {
  getMyProfile,
  login,
  logout,
  register,
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

//get my profile

// change password

//update profile

//update profile picture

//forgot password
//reset password

//add to playlist

//remove form playlist

export default router;
