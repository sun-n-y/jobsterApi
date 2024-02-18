const mongoose = require('mongoose');

//when creating a job aka document, these are the fields
const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'please provide company name'],
      maxLength: 50,
    },
    position: {
      type: String,
      required: [true, 'please provide position'],
      maxLength: 100,
    },
    status: {
      type: String,
      enum: ['interview', 'declined', 'pending'],
      default: 'pending',
    },
    createdBy: {
      //tie job model to user model, with object ID from user model
      type: mongoose.Types.ObjectId,
      //which model to reference
      ref: 'User',
      required: [true, 'please provide user'],
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'internship'],
      default: 'full time',
    },
    jobLocation: {
      type: String,
      default: 'my city',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', JobSchema);
