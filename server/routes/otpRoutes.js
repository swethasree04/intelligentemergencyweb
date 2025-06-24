const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

const otpStore = {}; // In-memory OTP store

// Generate random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Route: POST /api/request-otp
router.post('/request-otp', async (req, res) => {
  const { hospitalName, userEmail } = req.body;
  const otp = generateOTP();
  otpStore[userEmail] = otp;

  console.log(`📨 Generated OTP for ${userEmail}: ${otp} for ${hospitalName}`);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Your Emergency OTP',
    text: `Your OTP for accessing emergency services at ${hospitalName} is: ${otp}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP sent to ${userEmail}`);
    res.status(200).send('✅ OTP sent to your email.');
  } catch (err) {
    console.error('❌ Error sending OTP:', err);
    res.status(500).send('❌ Failed to send OTP.');
  }
});

// Route: POST /api/verify-otp
router.post('/verify-otp', (req, res) => {
  const { userEmail, code } = req.body;

  if (otpStore[userEmail] === code) {
    delete otpStore[userEmail]; // Remove used OTP
    res.status(200).send('✅ OTP verified successfully.');
  } else {
    res.status(401).send('❌ Invalid OTP.');
  }
});

module.exports = router;
