const ErrorHandler = require("../utils/errorhandler");
const { Snowflake } = require("@theinternetfolks/snowflake");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");

// Register a User
exports.registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const id = Snowflake.generate();
    const user = await User.create({
      _id:id,
      name,
      email,
      password,
    });

    sendToken(user, 201, res);
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: String(error),
    });
  }
};

// Login User
exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        status: false,
        errors: [
          {
            param: "email",
            message: "The credentials you provided are invalid.",
            code: "INVALID_CREDENTIALS",
          },
        ],
      });
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        status: false,
        errors: [
          {
            param: "password",
            message: "The credentials you provided are invalid.",
            code: "INVALID_CREDENTIALS",
          },
        ],
      });
    }

    sendToken(user, 200, res);
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: String(error),
    });
  }
};

// Logout User
exports.logoutUser = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
};

exports.getUserDetails = async (req, res, next) => {
  const { _id, name, email, created_at } = req.user;
  try {
    return res.status(200).json({
      status: true,
      content: {
        data: {
          _id:_id,
          name,
          email,
          created_at,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: String(error),
    });
  }
};
