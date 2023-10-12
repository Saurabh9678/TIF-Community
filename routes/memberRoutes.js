const express = require("express");

const { addMember, deleteMember } = require("../controllers/memberController");

const { ValidateMember } = require("../validations/memberValidation");
const { isAuthenticatedUser } = require("../middleware/auth");
const { throwError } = require("../utils/helper");

const router = express.Router();

router
  .route("/")
  .post(
    isAuthenticatedUser,
    ValidateMember("addMember"),
    throwError,
    addMember
  );

router
  .route("/:id/:comId")
  .delete(
    isAuthenticatedUser,
    ValidateMember("deleteMember"),
    throwError,
    deleteMember
  );

module.exports = router;
