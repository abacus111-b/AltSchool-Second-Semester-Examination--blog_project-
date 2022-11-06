const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const createdUser = await User.create({
      firstName,
      lastName,
      email,
      password,
    });
    console.log('whyyy');
    const token = signToken(createdUser._id);
    res.status(201).json({
      status: 'successful',
      token,
      data: createdUser,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message || 'error occured',
    });
  }
};
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // if email and password exist

    if (!email || !password) {
      return res.status(403).json({
        message: 'Please input email and password',
      });
    }
    // if user exists and password is correct

    const user = await User.findOne({ email }).select('+password');
    // console.log(user);
    if (!user || !(await user.passwordIsValid(password, user.password))) {
      return res.status(403).json({
        message: 'Email or password is incorrect',
      });
      next();
    }

    // if everything is ok, send token to client
    const token = signToken(user._id);
    res.status(200).json({
      status: 'successful',
      token,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message || 'error occured',
    });
  }
};

module.exports = { createUser, loginUser };
