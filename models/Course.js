const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  courseProg: {
    type: String,
    required: true,
  },

  currYear: {
    type: int,
    required: true,
  },

  courseSem: {
    type: int,
    required: true,
  },

  courseNumber: {
    type: String,
    required: true,
  },
  DescTitle: {
    type: String,
    required: true,
  },
  Units: {
    type: int,
    required: true,
  },
  courseYear: {
    type: int,
    required: true,
  },
});

module.exports = mongoose.model("Course", userSchema);
