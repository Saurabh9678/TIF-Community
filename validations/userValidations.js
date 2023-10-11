const { body } = require("express-validator");
const User = require("../models/userModel");

exports.ValidateUser = (reqType) => {
  switch (reqType) {
    case "signupUser": {
      return [
        body("name")
          .isLength({ min: 2 })
          .withMessage({
            message: "Name must be at least 2 characters long",
            code: "INVALID_INPUT",
          })
          .bail(),
        body("email")
          .notEmpty()
          .withMessage({
            message: "Please enter email",
            code: "INVALID_INPUT",
          })
          .bail()
          .toLowerCase()
          .isEmail()
          .withMessage({
            message: "Please provide a valid email address.",
            code: "INVALID_INPUT",
          })
          .bail()
          .custom(async (value) => {
            return User.findOne({ email: value }).then((user) => {
              if (user) {
                return Promise.reject({
                  message: "User with this email address already exists.",
                  code: "RESOURCE_EXISTS",
                });
              }
            });
          }),
        body("password")
          .isLength({ min: 2 })
          .withMessage({
            message: "Password should be at least 2 characters.",
            code: "INVALID_INPUT",
          })
          .bail()
          .custom((value) => {
            if (!/[a-z]/.test(value) || !/[A-Z]/.test(value)) {
              return Promise.reject({
                message: "Password should be at least 2 characters.",
                code: "INVALID_INPUT",
              });
            }
            return true;
          }),
      ];
    }

    case "signinUser": {
      return [
        body("email")
          .notEmpty()
          .withMessage({
            message: "Please enter email",
            code: "INVALID_INPUT",
          })
          .bail()
          .toLowerCase()
          .isEmail()
          .withMessage({
            message: "Please provide a valid email address.",
            code: "INVALID_INPUT",
          })
          .bail(),
        body("password")
          .notEmpty()
          .withMessage({
            message: "Please enter password",
            code: "INVALID_INPUT",
          })
          .bail(),
      ];
    }
  }
};
