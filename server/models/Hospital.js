const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  emailFrom: String, // Hospital sender email
  smtp: {
    host: String,
    port: Number,
    secure: Boolean,
    auth: {
      user: String,
      pass: String
    }
  }
});

// For geospatial queries (like nearest hospital)
hospitalSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Hospital', hospitalSchema);
