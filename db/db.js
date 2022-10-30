const mongoose = require("mongoose");

function connectToDb(URI) {
  mongoose
    .connect(URI)
    .then(() => {
      console.log("Connection to MongoDB successful");
    })
    .catch((err) => {
      console.log("Connection to MongoDB failed", err.message);
    });
}

module.exports = connectToDb;
