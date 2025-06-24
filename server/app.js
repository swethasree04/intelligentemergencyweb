// app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const hospitalRoutes = require('./routes/hospitalRoutes');  // Import the routes

dotenv.config();

const app = express();
app.use(express.json()); // To parse JSON bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch(err => console.log('❌ MongoDB connection failed:', err));

// Use hospital routes
app.use('/api', hospitalRoutes);  // Prefix the routes with '/api'

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
