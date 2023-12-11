const mongoose = require("mongoose");

const petitionSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
    petitionee: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      ref: "User",
    },
    schedule: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "On-going",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Petition", petitionSchema);
