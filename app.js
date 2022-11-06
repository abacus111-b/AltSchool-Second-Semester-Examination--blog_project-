require('dotenv').config();
const express = require('express');
const userRouter = require('./routes/userRoute');
const storyRouter = require('./routes/storyRoute');
const connectToDb = require('./db/db');
const errorControl = require('./middlewares/errorControl');

const app = express();

// connect to database
connectToDb(process.env.DB_URI);

// use body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/users', userRouter);
app.use('/stories', storyRouter);

app.use(errorControl);
module.exports = app;
