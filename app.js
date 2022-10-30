require("dotenv").config();
const express = require("express");
const userRouter = require("./routes/userRoute");
const connectToDb = require("./db/db");

const app = express();

// connect to database
connectToDb(process.env.DB_URI);

// use body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/register", userRouter);

module.exports = app;
