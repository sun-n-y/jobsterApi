const express = require('express');
const {
  getAllJobs,
  createJob,
  getJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobs');
const testUser = require('../middleware/testUser');
const router = express.Router();

router.get('/', getAllJobs);
router.post('/', testUser, createJob);
router.get('/:id', getJob);
router.patch('/:id', testUser, updateJob);
router.delete('/:id', testUser, deleteJob);

module.exports = router;
