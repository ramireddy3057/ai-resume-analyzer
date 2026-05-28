const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: String,

  email: String,

  password: String,

  role: String,

  score: Number

});

module.exports = mongoose.model("User", userSchema);