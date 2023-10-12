const { body } = require("express-validator");
const {err_Code} = require("../utils/constants")



exports.ValidateCommunity = (reqType) => {
  switch (reqType) {
    case "createCommunity": {
      return [
        body("name")
          .isLength({ min: 2 })
          .withMessage({
            message: "Name must be at least 2 characters long",
            code: err_Code.INVALID_INPUT,
          })
          .bail(),
      ];
    }
  }
};
