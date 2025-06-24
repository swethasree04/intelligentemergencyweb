const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  aadhar: String,
  mobile: String,
  address: String,
  license: String,
  vehicle: String,
  photo: String
});

module.exports = mongoose.model('User', userSchema);
