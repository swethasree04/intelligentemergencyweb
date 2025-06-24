const mongoose = require("mongoose");

const emergencySchema = new mongoose.Schema({
  signalLocation: String,
  direction: String,
  active: Boolean,
  vehicleNumber: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Emergency", emergencySchema);
