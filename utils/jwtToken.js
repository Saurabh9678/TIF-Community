// Create Token and saving in cookie
const {env} = require("./constants")


const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      status: true,
      content: {
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          created_at: user.created_at,
        },
        meta: {
          access_token: token,
        },
      },
    });
};

module.exports = sendToken;
