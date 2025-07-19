require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const hospitalRoutes = require('./server/routes/hospitals');
const otpRoutes = require('./server/routes/otpRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ ADD THIS ROUTE TO FIX "Cannot GET /"
app.get('/', (req, res) => {
  res.send('🚨 Intelligent Emergency Web API is Live!');
});

app.use('/api/hospitals', hospitalRoutes);
app.use('/api/otp', otpRoutes);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected");
  app.listen(process.env.PORT || 5001, () => {
    console.log("Server running on port", process.env.PORT);
  });
}).catch(err => console.log(err));
