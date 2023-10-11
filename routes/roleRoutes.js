const express = require("express");

const { createRole, getAllRoles } = require("../controllers/roleController");

const { ValidateRole } = require("../validations/roleValidation");

const { throwError } = require("../utils/helper");

const router = express.Router();

router
  .route("/")
  .post(ValidateRole("createRole"), throwError, createRole)
  .get(getAllRoles);

module.exports = router;
