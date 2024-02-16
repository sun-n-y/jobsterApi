const express = require('express');
const { register, login, updateUser } = require('../controllers/auth');
const authenticateUser = require('../middleware/authentication');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.patch('/updateUser', authenticateUser, updateUser);

module.exports = router;
