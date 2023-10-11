const Role = require("../models/roleModel");
const Community = require("../models/communityModel");
const { validationResult } = require("express-validator");

const throwError = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      param: error.path,
      message: error.msg.message,
      code: error.msg.code,
    }));

    res.status(400).json({ status: false, errors: formattedErrors });
  } else {
    next();
  }
};

const getScopes = (name) => {
  if (name.includes("admin")) return ["admin", "moderator", "member"];
  else if (name.includes("moderator")) return ["moderator", "member"];
  else return ["member"];
};

const getRoleId = async (role) => {
  try {
    const roleExist = await Role.findOne({ name: role });
    if (roleExist) return roleExist.id;
    else return 0;
  } catch (error) {
    return 0;
  }
};

const getSlugName = async (name) => {
  let slug = name.toLowerCase().replace(/ /g, "-");

  let isUnique = false;
  let originalSlug = slug;

  while (!isUnique) {
    const existingCommunity = await Community.findOne({ slug });

    if (!existingCommunity) {
      isUnique = true;
    } else {
      const randomChar = Math.random().toString(36).substring(2, 5);
      slug = originalSlug + randomChar;
    }
  }

  return slug;
};

module.exports = {
  throwError,
  getScopes,
  getRoleId,
  getSlugName,
};
