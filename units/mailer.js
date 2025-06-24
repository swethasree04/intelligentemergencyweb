const nodemailer = require('nodemailer');
require('dotenv').config(); // Load variables from .env

// Create transporter using Gmail and App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS  // Your Gmail App Password
  }
});

/**
 * Sends an OTP email to the user.
 * @param {string} email - User's email address.
 * @param {string} otp - The OTP code to be sent.
 * @returns {Promise} - Resolves on success or rejects with error.
 */
exports.sendOtpMail = (email, otp) => {
  const mailOptions = {
    from: `"YourApp Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔐 Your OTP Code for Password Reset',
    html: `
      <div style="font-family: Arial, sans-serif; padding:
  }}