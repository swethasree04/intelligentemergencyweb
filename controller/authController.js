const User = require('../models/User');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
  try {
    const { name, password, licenseNumber, aadhaarNumber, vehicleNumber } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      password: hashedPassword,
      licenseNumber,
      aadhaarNumber,
      vehicleNumber
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerUser };
