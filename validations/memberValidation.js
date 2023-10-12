const { body, param } = require("express-validator");
const Role = require("../models/roleModel");
const Community = require("../models/communityModel");
const User = require("../models/userModel");
const {err_Code} = require("../utils/constants")


exports.ValidateMember = (reqType) => {
  switch (reqType) {
    case "addMember": {
      return [
        body("community").custom(async (value) => {
          return Community.findById(value).then((community) => {
            if (!community) {
              return Promise.reject({
                message: "Community not found.",
                code: err_Code.RESOURCE_NOT_FOUND,
              });
            }
          });
        }),
        body("user").custom(async (value) => {
          return User.findById(value).then((user) => {
            if (!user) {
              return Promise.reject({
                message: "User not found.",
                code: err_Code.RESOURCE_NOT_FOUND,
              });
            }
          });
        }),
        body("role").custom(async (value) => {
          return Role.findById(value).then((role) => {
            if (!role) {
              return Promise.reject({
                message: "Role not found.",
                code: err_Code.RESOURCE_NOT_FOUND,
              });
            }
          });
        }),
      ];
    }
    case "deleteMember": {
      return [
        param("id").custom(async (value) => {
          return User.findById(value).then((user) => {
            if (!user) {
              return Promise.reject({
                message: "User not found.",
                code: err_Code.RESOURCE_NOT_FOUND,
              });
            }
          });
        }),
        param("comId").custom(async (value) => {
          return Community.findById(value).then((community) => {
            if (!community) {
              return Promise.reject({
                message: "Community not found.",
                code: err_Code.RESOURCE_NOT_FOUND,
              });
            }
          });
        }),
      ];
    }
  }
};
