const express = require("express");

const {
  loginUser,
  registerUser,
  logoutUser,
  getUserDetail,
  getUserDetailsPostman,
  updateUserDetail,
  getAllUsersDetailsPostman,
} = require("../controllers/userController");

const { isAuthenticatedUser } = require("../middleware/auth");





const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(isAuthenticatedUser, logoutUser);


module.exports = router;
