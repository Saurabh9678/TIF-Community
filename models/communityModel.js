const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({
  _id: {
    type: String,
    required:true
  },
  name: {
    type: String,
    required:true
  },
  slug: {
    type: String,
    required:true
  },
  owner: {
    type: String,
    required:true
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Community", communitySchema);
