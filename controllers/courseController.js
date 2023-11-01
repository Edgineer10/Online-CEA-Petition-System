const Course = require("../models/Course");
const asyncHandler = require("express-async-handler");

// @desc Get all course
// @route GET /course
// @access Private
const getAllCourses = asyncHandler(async (req, res) => {
  // Get all users from MongoDB
  const courses = await Course.find().select().lean();

  // If no users
  if (!courses?.length) {
    return res.status(400).json({ message: "No users found" });
  }

  res.json(courses);
});

// @desc Create new user
// @route POST /users
// @access Private
const createNewCourse = asyncHandler(async (req, res) => {
  const {
    courseProg,
    currYear,
    courseNumber,
    DescTitle,
    Units,
    courseYear,
    courseSem,
  } = req.body;

  // Confirm data
  if (
    !courseProg ||
    !currYear ||
    !courseNumber ||
    !DescTitle ||
    !Units ||
    !courseYear ||
    !courseSem
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate username
  const duplicate = await User.findOne({ courseNumber }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate idNumber" });
  }

  // Hash password

  const courseObject = {
    courseProg,
    currYear,
    courseNumber,
    DescTitle,
    Units,
    courseYear,
    courseSem,
  };

  // Create and store new user
  const course = await Course.create(courseObject);

  if (course) {
    //created
    res.status(201).json({ message: `New user ${courseNumber} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

// @desc Update a user
// @route PATCH /users
// @access Private
const updateCourse = asyncHandler(async (req, res) => {
  const {
    id,
    courseProg,
    currYear,
    courseNumber,
    DescTitle,
    Units,
    courseYear,
    courseSem,
  } = req.body;

  // Confirm data
  if (
    !courseProg ||
    !currYear ||
    !courseNumber ||
    !DescTitle ||
    !Units ||
    !courseYear ||
    !courseSem
  ) {
    return res
      .status(400)
      .json({ message: "All fields except password are required" });
  }

  // Does the user exist to update?
  const course = await User.findById(id).exec();

  if (!course) {
    return res.status(400).json({ message: "User not found" });
  }

  // Check for duplicate
  const duplicate = await User.findOne({ courseNumber }).lean().exec();

  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate courseNumber" });
  }
  course.courseProg = courseProg;
  course.currYear = currYear;
  course.courseNumber = courseNumber;
  course.DescTitle = DescTitle;
  course.Units = Units;
  course.courseYear = courseYear;
  course.courseSem = courseSem;

  const updatedCourse = await course.save();

  res.json({ message: `${updatedCourse.idNumber} updated` });
});

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  // Does the user exist to delete?
  const course = await Course.findById(id).exec();

  if (!course) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await course.deleteOne();

  const reply = `Username ${result.idNumber} with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllCourse,
  createNewCourse,
  updateCourse,
  deleteCourse,
};
