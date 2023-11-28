const User = require("../models/User");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
  // Get all users from MongoDB
  const users = await User.find().select("-password").lean();

  // If no users
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }

  res.json(users);
};

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
  const {
    idNumber,
    password,
    role,
    firstName,
    lastName,
    middleName,
    birthday,
    year,
    courseProg,
  } = req.body;

  // Confirm data
  if (
    !idNumber ||
    !password ||
    !role ||
    !firstName ||
    !lastName ||
    !middleName ||
    !birthday ||
    !year ||
    !courseProg
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate username
  const duplicate = await User.findOne({ idNumber: idNumber }).collation({ locale: 'en', strength: 2 }).lean().exec()

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate idNumber" });
  }

  // Hash password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  const userObject = {
    idNumber,
    password: hashedPwd,
    role,
    firstName,
    lastName,
    middleName,
    birthday,
    year,
    courseProg,
  };

  // Create and store new user
  const user = await User.create(userObject);

  if (user) {
    //created
    res.status(201).json({ message: `New user ${idNumber} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
};

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
  const {
    id,
    idNumber,
    role,
    password,
    firstName,
    lastName,
    middleName,
    birthday,
    year,
    active,
    courseProg,
  } = req.body;

  // Confirm data
  if (
    !firstName ||
    !lastName ||
    !role ||
    !middleName ||
    !birthday ||
    !year ||
    !courseProg ||
    typeof active !== "boolean"
  ) {
    return res
      .status(400)
      .json({ message: "All fields except password are required" });
  }

  // Does the user exist to update?
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Check for duplicate
  const duplicate = await User.findOne({ idNumber }).lean().exec();

  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate idNumber" });
  }
  user.firstName = firstName;
  user.lastName = lastName;
  user.middleName = middleName;
  user.birthday = birthday;
  user.year = year;
  user.courseProg = courseProg;
  user.active = active;
  user.role = role;

  if (password) {
    // Hash password
    user.password = await bcrypt.hash(password, 10); // salt rounds
  }

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.idNumber} updated` });
};

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  // Does the user exist to delete?
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await user.deleteOne();

  const reply = `Username ${result.idNumber} with ID ${result._id} deleted`;

  res.json(reply);
};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
