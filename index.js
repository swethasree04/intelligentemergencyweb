require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const hospitalRoutes = require('./server/routes/hospitals');
const otpRoutes = require('./server/routes/otpRoutes'); // ✅ Add this line

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/hospitals', hospitalRoutes);
app.use('/api/otp', otpRoutes); // ✅ Connect OTP route here

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected");
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port", process.env.PORT);
  });
}).catch(err => console.log(err));
