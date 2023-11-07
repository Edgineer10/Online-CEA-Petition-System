const Petition = require("../models/Petition")
const Course = require("../models/Course")
const asyncHandler = require("express-async-handler")

// @desc Get all petitions
// @route GET /petitions
// @access Private
const getAllPetitions = asyncHandler(async (req, res) => {
  // Get all petitions from MongoDB
  const petitions = await Petition.find().select().lean();

  // If no petitions
  if (!petitions?.length) {
    return res.status(400).json({ message: "No petitions found" });
  }

  const petitionWithDetails = await Promise.all(
    petitions.map(async (petition) => {
      const course = await Course.findById(petition.course).lean().exec()
      return { ...petition, courseProg: course.courseProg, courseCode: course.courseCode, descTitle: course.descTitle, unit: course.unit }
    }))

  res.json(petitionWithDetails);
});

// @desc Create new petition
// @route POST /petitions
// @access Private
const createNewPetition = asyncHandler(async (req, res) => {
  const { course, petitionee, schedule } = req.body;

  // Confirm data
  if (!course || !petitionee || !schedule) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const petitionObject = {
    course,
    petitionee,
    schedule,
  };

  // Create and store new petition
  const petition = await Petition.create(petitionObject);
  const courseDet = Course.findById(course).lean().exec();

  if (petition) {
    //created
    res.status(201).json({
      message: `New petition of subject ${courseDet.courseCode} created`,
    });
  } else {
    res.status(400).json({ message: "Invalid petition data received" });
  }
});

// @desc Update a petition
// @route PATCH /petitions
// @access Private
const updatePetition = asyncHandler(async (req, res) => {
  const { course, petitionee, schedule } = req.body;

  // Confirm data
  if (!course || !petitionee.length || !schedule || !Array.isArray(petitionee)) {
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
  petition.schedule = schedule;

  const updatedpetition = await petition.save();
  const courseDet = Course.findById(course).lean().exec();

  res.json({ message: `${courseDet.courseCode} updated` });
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
