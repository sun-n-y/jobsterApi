const { StatusCodes } = require('http-status-codes');
const JobModel = require('../models/Job');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllJobs = async (req, res) => {
  //get the values from frontend
  const { status, jobType, search, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  //if any of the below fields exists add to query object
  if (search) {
    //can be company
    queryObject.position = { $regex: search, $options: 'i' };
  }

  if (status && status != 'all') {
    queryObject.status = status;
  }

  if (jobType && jobType != 'all') {
    queryObject.jobType = jobType;
  }

  //so we can chain more logic
  let result = JobModel.find(queryObject);

  //chain sorts
  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }
  if (sort === 'a-z') {
    result = result.sort('position');
  }
  if (sort === 'z-a') {
    result = result.sort('-position');
  }

  const jobs = await result;
  res.status(StatusCodes.OK).json({ jobs });
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
