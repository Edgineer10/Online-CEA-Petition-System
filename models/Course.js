const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseProg: {
    type: String,
    required: true,
  },

  currYear: {
    type: Number,
    required: true,
  },

  courseSem: {
    type: Number,
    required: true,
  },

  courseCode: {
    type: String,
    required: true,
  },
  DescTitle: {
    type: String,
    required: true,
  },
  Units: {
    type: Number,
    required: true,
  },
  courseYear: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Course", courseSchema);
