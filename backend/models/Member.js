const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  age: Number,
  phone: String,
  membershipType: {
    type: String,
    enum: ["Monthly", "Yearly"]
  },
  feesPaid: {
    type: Boolean,
    default: false
  },
  joinDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Member", memberSchema);