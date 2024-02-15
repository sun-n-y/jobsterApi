const { StatusCodes } = require('http-status-codes');
const JobModel = require('../models/Job');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllJobs = async (req, res) => {
  const jobs = await JobModel.find({ createdBy: req.user.userId }).sort(
    'createdAt'
  );
  res.status(StatusCodes.OK).json({ count: jobs.length, jobs });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  //check for both, otherwise id can be used to bring in other users info
  const singleJob = await JobModel.findOne({ _id: jobId, createdBy: userId });

  if (!singleJob) {
    throw new NotFoundError(`jobID: ${jobId} does not exist`);
  }

  res.status(StatusCodes.OK).json({ singleJob });
};

const createJob = async (req, res) => {
  //add user obtained from prev middleware to req body here to build relationship
  req.body.createdBy = req.user.userId;
  const job = await JobModel.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;

  if (company === '' || position === '') {
    throw new BadRequestError(`company or position cannot be empty`);
  }

  const singleJob = await JobModel.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!singleJob) {
    throw new NotFoundError(`jobID: ${jobId} does not exist`);
  }

  res.status(StatusCodes.OK).json({ singleJob });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const singleJob = await JobModel.findOneAndDelete({
    _id: jobId,
    createdBy: userId,
  });

  if (!singleJob) {
    throw new NotFoundError(`jobID: ${jobId} does not exist`);
  }

  res.status(StatusCodes.OK).send();
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
