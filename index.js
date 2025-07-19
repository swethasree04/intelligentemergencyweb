require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // ✅ Import path for serving static files

const hospitalRoutes = require('./server/routes/hospitals');
const otpRoutes = require('./server/routes/otpRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve static frontend files from the "frontpage" folder
app.use(express.static(path.join(__dirname, 'frontpage')));

// ✅ Serve register.html when visiting root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontpage', 'register.html'));
});

// API routes
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/otp', otpRoutes);

// Database and server start
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected");
  app.listen(process.env.PORT || 5001, () => {
    console.log("Server running on port", process.env.PORT);
  });
}).catch(err => console.log(err));
