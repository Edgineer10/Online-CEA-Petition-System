const Petition = require("../models/Petition")
const Course = require("../models/Course")

// @desc Get all petitions
// @route GET /petitions
// @access Private
const getAllPetitions = async (req, res) => {
  // Get all petitions from MongoDB
  const petitions = await Petition.find().select().lean();

  // If no petitions
  if (!petitions?.length) {
    return res.status(400).json({ message: "No petitions found" });
  }

  const petitionWithDetails = await Promise.all(
    petitions.map(async (petition) => {
      const course = await Course.findById(petition.course).lean().exec()
      if (course) return { ...petition, courseProg: course.courseProg, courseCode: course.courseCode, descTitle: course.descTitle, unit: course.unit, currYear: course.currYear }
      else return { ...petition, courseProg: [""], courseCode: "Course Not Found", descTitle: "Course Not Found", unit: "Course Not Found", currYear: "Course Not Found" }
    }))

  res.json(petitionWithDetails);
};

// @desc Create new petition
// @route POST /petitions
// @access Private
const createNewPetition = async (req, res) => {
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
};

// @desc Update a petition
// @route PATCH /petitions
// @access Private
const updatePetition = async (req, res) => {
  const { id, course, petitionee, schedule, status, remark } = req.body;

  // Confirm data
  if (!course || !petitionee.length || !schedule || !Array.isArray(petitionee) || !status || !remark) {
    return res
      .status(400)
      .json({ message: "All fields are required" });
  }

  // Does the petition exist to update?
  const petition = await Petition.findById(id).exec();

  if (!petition) {
    return res.status(400).json({ message: "petition not found" });
  }

  petition.course = course;
  petition.petitionee = petitionee;
  petition.schedule = schedule;
  petition.status = status
  petition.remark = remark


  const updatedpetition = await petition.save();

  res.json({ message: ` updated` });
};

// @desc Delete a petition
// @route DELETE /petitions
// @access Private
const deletePetition = async (req, res) => {
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
};

module.exports = {
  getAllPetitions,
  createNewPetition,
  updatePetition,
  deletePetition,
};
