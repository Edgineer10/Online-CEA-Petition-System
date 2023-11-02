const Petition = require("../models/Petition");
const asyncHandler = require("express-async-handler");

// @desc Get all petitions
// @route GET /petitions
// @access Private
const getAllPetitions = asyncHandler(async (req, res) => {
  // Get all petitions from MongoDB
  const petitions = await Petition.find().select("-password").lean();

  // If no petitions
  if (!petitions?.length) {
    return res.status(400).json({ message: "No petitions found" });
  }

  res.json(petition);
});

// @desc Create new petition
// @route POST /petitions
// @access Private
const createNewPetition = asyncHandler(async (req, res) => {
  const { course, petitionee, Schedule } = req.body;

  // Confirm data
  if (!course || !petitionee || !Schedule) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const petitionObject = {
    course,
    petitionee,
    Schedule,
  };

  // Create and store new petition
  const petition = await Petition.create(petitionObject);

  if (petition) {
    //created
    res.status(201).json({
      message: `New petition of subject ${course.courseCode} created`,
    });
  } else {
    res.status(400).json({ message: "Invalid petition data received" });
  }
});

// @desc Update a petition
// @route PATCH /petitions
// @access Private
const updatePetition = asyncHandler(async (req, res) => {
  const { course, petitionee, Schedule } = req.body;

  // Confirm data
  if (!course || !petitionee || !Schedule || !Array.isArray(petitionee)) {
    return res
      .status(400)
      .json({ message: "All fields except password are required" });
  }

  // Does the petition exist to update?
  const petition = await Petition.findById(id).exec();

  if (!petition) {
    return res.status(400).json({ message: "petition not found" });
  }

  petition.course = course;
  petition.petitionee = petitionee;
  petition.Schedule = Schedule;

  const updatedpetition = await petition.save();

  res.json({ message: `${updatedpetition.course.coursCode} updated` });
});

// @desc Delete a petition
// @route DELETE /petitions
// @access Private
const deletePetition = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Petition ID Required" });
  }

  // Does the petition exist to delete?
  const petition = await Petition.findById(id).exec();

  if (!petition) {
    return res.status(400).json({ message: "Petition not found" });
  }

  const result = await petition.deleteOne();

  const reply = `petition of a subject ${result.course.courseCode}  deleted`;

  res.json(reply);
});

module.exports = {
  getAllPetitions,
  createNewPetition,
  updatePetition,
  deletePetition,
};
