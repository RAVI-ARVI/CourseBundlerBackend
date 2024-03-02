import express from "express";
import {
  addToPlaylist,
  changeMyPassword,
  deleteMe,
  deleteUserRole,
  forgotPassword,
  getAllUsers,
  getMyProfile,
  login,
  logout,
  register,
  removeFromPlaylist,
  resetPassword,
  updateProfile,
  updateProfilePicture,
  updateUserRole,
} from "../Controllers/userController.js";
import { isAutharaizedAdmin, isAuthenticated } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

//register new user

router.route("/register").post(singleUpload, register);

//login user
router.route("/login").post(login);

//logout user

router.route("/logout").get(logout);

router
  .route("/myprofile")
  .get(isAuthenticated, getMyProfile)
  .delete(isAuthenticated, deleteMe);
router.route("/changepassword").put(isAuthenticated, changeMyPassword);
router.route("/updateprofile").put(isAuthenticated, updateProfile);
router
  .route("/updateprofilepicture")
  .put(isAuthenticated, singleUpload, updateProfilePicture);

router.route("/forgotpassword").post(forgotPassword);

router.route("/reset/:token").put(resetPassword);

router.route("/addtoplaylist").post(isAuthenticated, addToPlaylist);

router.route("/removetoplaylist").delete(isAuthenticated, removeFromPlaylist);

//Admin Routes

router
  .route("/admin/users")
  .get(isAuthenticated, isAutharaizedAdmin, getAllUsers);

router
  .route("/admin/user/:id")
  .put(isAuthenticated, isAutharaizedAdmin, updateUserRole)
  .delete(isAuthenticated, isAutharaizedAdmin, deleteUserRole);

export default router;
