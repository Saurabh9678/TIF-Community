const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  name: {
    type: String,
  },
  slug: {
    type: String,
  },
  owner: {
    type: String,
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
