require("dotenv").config();
const express = require("express");
const userRouter = require("./routes/userRoute");

const app = express();

app.use("/register", userRouter);

module.exports = app;
