const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  community: {
    type: String,
  },
  user: {
    type: String,
  },
  role: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Member", memberSchema);
