const Course = require("../models/Course");
const asyncHandler = require("express-async-handler");

// @desc Get all course
// @route GET /course
// @access Private
const getAllCourses = asyncHandler(async (req, res) => {
  // Get all courses from MongoDB
  const courses = await Course.find().select().lean();

  // If no courses
  if (!courses?.length) {
    return res.status(400).json({ message: "No courses found" });
  }

  res.json(courses);
});

// @desc Create new course
// @route POST /courses
// @access Private
const createNewCourse = asyncHandler(async (req, res) => {
  const {
    courseProg,
    currYear,
    courseCode,
    descTitle,
    unit,
    courseYear,
    courseSem,
  } = req.body;

  // Confirm data
  if (
    !courseProg.length ||
    !currYear ||
    !courseCode ||
    !descTitle ||
    !unit ||
    !courseYear ||
    !courseSem
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate course code
  const duplicate = await Course.findOne({ courseCode }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate course code" });
  }

  // Hash password

  const courseObject = {
    courseProg,
    currYear,
    courseCode,
    descTitle,
    unit,
    courseYear,
    courseSem,
  };

  // Create and store new course
  const course = await Course.create(courseObject);

  if (course) {
    //created
    res.status(201).json({ message: `New course ${courseCode} created` });
  } else {
    res.status(400).json({ message: "Invalid course data received" });
  }
});

// @desc Update a course
// @route PATCH /courses
// @access Private
const updateCourse = asyncHandler(async (req, res) => {
  const {
    id,
    courseProg,
    currYear,
    courseCode,
    descTitle,
    unit,
    courseYear,
    courseSem,
  } = req.body;

  // Confirm data
  if (
    !courseProg.length ||
    !currYear ||
    !courseCode ||
    !descTitle ||
    !unit ||
    !courseYear ||
    !courseSem
  ) {
    return res.status(400).json({ message: "All fields required" });
  }

  // Does the course exist to update?
  const course = await Course.findById(id).exec();

  if (!course) {
    return res.status(400).json({ message: "Course not found" });
  }

  // Check for duplicate
  const duplicate = await Course.findOne({ courseCode }).lean().exec();

  // Allow updates to the original course
  if (duplicate && duplicate?._id.toString() !== id.toString()) {
    return res.status(409).json({ message: "Duplicate courseCode" });
  }
  course.courseProg = courseProg;
  course.currYear = currYear;
  course.courseCode = courseCode;
  course.descTitle = descTitle;
  course.unit = unit;
  course.courseYear = courseYear;
  course.courseSem = courseSem;

  const updatedCourse = await course.save();

  res.json({ message: `${updatedCourse.courseCode} updated` });
});

// @desc Delete a course
// @route DELETE /courses
// @access Private
const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "course ID Required" });
  }

  // Does the course exist to delete?
  const course = await Course.findById(id).exec();

  if (!course) {
    return res.status(400).json({ message: "Course not found" });
  }

  const result = await course.deleteOne();

  const reply = `Course ${result.descTitle} with course code ${result.courseCode} deleted`;

  res.json(reply);
});

module.exports = {
  getAllCourses,
  createNewCourse,
  updateCourse,
  deleteCourse,
};
