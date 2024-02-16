const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please provide name'],
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, 'please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'please provide valid email',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'please provide password'],
    minLength: 6,
  },
  lastName: {
    type: String,
    trim: true,
    maxLength: 20,
    default: 'lastName',
  },
  location: {
    type: String,
    trim: true,
    maxLength: 20,
    default: 'my city',
  },
});

//using function keyword will let us use this keyword, pointing to each document
//mongoose middleware
//this,.. points to our document to be created,
//before we save each document to the DB, what do we want to accomplish
UserSchema.pre('save', async function () {
  //if we are not modifying the password, return
  if (!this.isModified('password')) {
    return;
  }
  //hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  //passed onto next middleware automatically
});

//schema instance methods

//create token, with data we want to send back and expiration
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

//check user entered password against hashed password in document in the database
UserSchema.methods.checkPassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
