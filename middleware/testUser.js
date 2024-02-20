const { BadRequestError } = require('../errors');

//grab req.user to get values from auth middleware
const testUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new BadRequestError('test user. read only');
  }
  next();
};

module.exports = testUser;
