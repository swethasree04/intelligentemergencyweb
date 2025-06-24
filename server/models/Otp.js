const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    lowercase: true, // ensures email is stored in lowercase
    trim: true 
  },
  code: { 
    type: String, 
    required: true 
  },
  expires: { 
    type: Date, 
    required: true 
  }
}, {
  timestamps: true // adds createdAt and updatedAt fields
});

// TTL index: Auto-delete expired OTP documents based on 'expires' field
otpSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Otp', otpSchema);
