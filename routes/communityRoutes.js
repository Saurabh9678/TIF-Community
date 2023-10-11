const express = require("express");

const {
  createCommunity,
  getAllCommunity,
  getAllMembersInCommunity,
  getOwnCommunities,
  getMemberCommunity,
} = require("../controllers/communityController");

const { isAuthenticatedUser } = require("../middleware/auth");

const { ValidateCommunity } = require("../validations/communityValidation");

const { throwError } = require("../utils/helper");

const router = express.Router();

router
  .route("/")
  .post(
    isAuthenticatedUser,
    ValidateCommunity("createCommunity"),
    throwError,
    createCommunity
  )
  .get(getAllCommunity);

router.route("/:id/members").get(getAllMembersInCommunity);

router.route("/me/owner").get(isAuthenticatedUser, getOwnCommunities);

router.route("/me/member").get(isAuthenticatedUser, getMemberCommunity);

module.exports = router;
