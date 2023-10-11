const { body } = require("express-validator");


exports.ValidateCommunity = (reqType) => {
  switch (reqType) {
    case "createCommunity": {
      return [
        body("name")
          .isLength({ min: 2 })
          .withMessage({
            message: "Name must be at least 2 characters long",
            code: "INVALID_INPUT",
          })
          .bail(),
      ];
    }
  }
};
