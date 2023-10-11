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

module.exports = {
  throwError,
  getScopes
};
