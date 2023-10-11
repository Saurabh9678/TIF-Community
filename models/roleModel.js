const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  _id:{
    type:String
  },
  name: {
    type: String,
    required: [true, "Please Enter role name"],
  },
  scopes: [
    {
      type: String,
    },
  ],
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Role", roleSchema);
