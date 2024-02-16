const { BadRequestError, UnauthenticatedError } = require('../errors');
const UserModel = require('../models/User');
const { StatusCodes } = require('http-status-codes');

const register = async (req, res) => {
  //using mongoose middleware pre, to hash password
  //mongoose does the validation
  const user = await UserModel.create({ ...req.body });
  //create token, using schema instance
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      token,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  //check for valid values
  if (!email || !password) {
    throw new BadRequestError('please provide email and password');
  }
  //check for user in database
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError('invalid credentials');
  }
  //compare password
  const isPasswordCorrect = await user.checkPassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('invalid credentials');
  }
  //create token
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      token,
    },
  });
};

const updateUser = async (req, res) => {
  //check for valid values
  const { email, name, lastName, location } = req.body;
  if (!email || !name || !lastName || !location) {
    throw new BadRequestError('please provide all values');
  }
  //get user from db
  const user = await UserModel.findOne({ _id: req.user.userId });
  //update db doc with frontend values
  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;
  await user.save();
  //create token
  const token = user.createJWT();

  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      token,
    },
  });
};

module.exports = { register, login, updateUser };
