const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const auth = async (req, res, next) => {
  //check header, for authorization bearer token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication invalid');
  }

  const token = authHeader.split(' ')[1];

  try {
    //verify token, to get payload data like username and id to pass along
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    //attach user to job routes, by adding property to request object
    req.user = { userId: payload.userId, name: payload.name };
    //pass along to job routes
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid');
  }
};

module.exports = auth;
