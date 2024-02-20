const express = require('express');
const { register, login, updateUser } = require('../controllers/auth');
const authenticateUser = require('../middleware/authentication');
const testUser = require('../middleware/testUser');

const router = express.Router();

const rateLimiter = require('express-rate-limit');
const apiLimiter = rateLimiter({
  windowMS: 15 * 60 * 100, //15 mins
  max: 10, //requests
  //frontend is looking for this
  message: {
    msg: 'too many request from this IP, please try again after 15 minutes',
  },
});

router.post('/register', apiLimiter, register);
router.post('/login', apiLimiter, login);
router.patch('/updateUser', authenticateUser, testUser, updateUser);

module.exports = router;
