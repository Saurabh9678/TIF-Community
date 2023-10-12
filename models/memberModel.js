const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  _id: {
    type: String,
    required:true
  },
  community: {
    type: String,
    required:true
  },
  user: {
    type: String,
    required:true
  },
  role: {
    type: String,
    required:true
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Member", memberSchema);
