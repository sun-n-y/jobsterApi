require('dotenv').config();
const mockData = require('./mock_data.json');
const JobModel = require('./models/Job');
const connectDB = require('./db/connect');

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await JobModel.create(mockData);
    console.log('Success, database populated');
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
