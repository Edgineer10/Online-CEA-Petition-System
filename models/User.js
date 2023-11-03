const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  idNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  courseProg: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("User", userSchema);
