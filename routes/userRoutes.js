const express = require("express");

const { isAuthenticatedUser } = require("../middleware/auth");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails
} = require("../controllers/userController");
const { ValidateUser } = require("../validations/userValidations");

const { throwError } = require("../utils/helper");

const router = express.Router();

router
  .route("/auth/signup")
  .post(ValidateUser("signupUser"), throwError, registerUser);
router
  .route("/auth/signin")
  .post(ValidateUser("signinUser"), throwError, loginUser);

router.route("/auth/signout").get(isAuthenticatedUser, logoutUser);

router.route("/auth/me").get(isAuthenticatedUser, getUserDetails)

module.exports = router;
