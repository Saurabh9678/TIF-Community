const { body } = require("express-validator");
const Role = require("../models/roleModel")

exports.ValidateRole = (reqType) => {
  switch (reqType) {
    case "createRole": {
      return [
        body("name")
          .isLength({ min: 2 })
          .withMessage({
            message: "Name must be at least 2 characters long",
            code: "INVALID_INPUT",
          })
          .bail()
          .custom(async (value) => {
            return Role.findOne({ name: value }).then((role) => {
              if (role) {
                return Promise.reject({
                  message: "Role already exists.",
                  code: "RESOURCE_EXISTS",
                });
              }
            });
          }),
      ];
    }
  }
};
