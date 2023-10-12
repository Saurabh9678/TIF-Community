const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {env} = require("../utils/constants")


const userSchema = new mongoose.Schema({
  _id:{
    type:String
  },
  name: {
    type: String,
    required: [true, "Please Enter your name"],
  },
  email: {
    type: String,
    unique:true,
    required: [true, "Please Enter your email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter your password"],
    select: false,
  },
  created_at:{
    type:Date,
    default: Date.now()
  },
  updated_at:{
    type:Date,
    default: Date.now()
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRE,
  });
  
};

// Compare Password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};


module.exports = mongoose.model("User", userSchema);