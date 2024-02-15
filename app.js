require('dotenv').config();
require('express-async-errors');
const path = require('path');
//security packages
const helmet = require('helmet');
const xss = require('xss-clean');
const express = require('express');
const app = express();
//error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');

// security/other packages
app.set('trust proxy', 1);

//middlewares
app.use(express.static(path.resolve(__dirname, './client/build')));
app.use(express.json());
app.use(helmet());
app.use(xss());

//routes
app.use('/api/v1/auth', authRouter);
//authenticated route, so users only have access to their info
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

//all get req, will be served the index.html in the client build, making it our home page
//from there the react application takes over
app.get('*', (res, req) => {
  res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
