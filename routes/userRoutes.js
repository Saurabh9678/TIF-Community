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
  .route("/signup")
  .post(ValidateUser("signupUser"), throwError, registerUser);
router
  .route("/signin")
  .post(ValidateUser("signinUser"), throwError, loginUser);

router.route("/signout").get(isAuthenticatedUser, logoutUser);

router.route("/me").get(isAuthenticatedUser, getUserDetails)

module.exports = router;
