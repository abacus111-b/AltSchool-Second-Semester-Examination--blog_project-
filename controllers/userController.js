const User = require("../models/userModel");

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const createdUser = await User.create({
      firstName,
      lastName,
      email,
      password,
    });
    res.status(201).json({
      status: "successful",
      data: createdUser,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message || "error occured",
    });
  }
};
const revertUser = (req, res) => {
  console.log("Get off my page");
  res.end();
};

module.exports = { createUser, revertUser };
