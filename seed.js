const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Hospital = require('./server/models/hospital.js'); // Adjust path if needed

// ✅ Load environment variables
dotenv.config();

// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Common SMTP config
const smtpSettings = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'testotp.hospital@gmail.com',
    pass: process.env.EMAIL_PASS
  }
};

// ✅ Hospital data
const hospitalsData = [
  {
    name: 'Rela Hospital',
    location: { type: 'Point', coordinates: [80.2209, 13.0103] },
    emailFrom: 'testotp.hospital@gmail.com',
    smtp: smtpSettings
  },
  {
    name: 'MIOT International',
    location: { type: 'Point', coordinates: [80.1692, 13.0111] },
    emailFrom: 'testotp.hospital@gmail.com',
    smtp: smtpSettings
  },
  {
    name: 'Fortis Malar Hospital',
    location: { type: 'Point', coordinates: [80.2577, 13.0066] },
    emailFrom: 'testotp.hospital@gmail.com',
    smtp: smtpSettings
  },
  {
    name: 'Sri Ramachandra Medical Centre',
    location: { type: 'Point', coordinates: [80.1490, 13.0340] },
    emailFrom: 'testotp.hospital@gmail.com',
    smtp: smtpSettings
  },
  {
    name: 'Global Hospitals',
    location: { type: 'Point', coordinates: [80.2263, 12.9092] },
    emailFrom: 'testotp.hospital@gmail.com',
    smtp: smtpSettings
  },
  {
    name: 'SIMS Hospital',
    location: { type: 'Point', coordinates: [80.2118, 13.0533] },
    emailFrom: 'testotp.hospital@gmail.com',
    smtp: smtpSettings
  },
  {
    name: 'Chennai National Hospital',
    location: { type: 'Point', coordinates: [80.2752, 13.0794] },
    emailFrom: 'testotp.hospital@gmail.com',
    smtp: smtpSettings
  },
  {
    name: 'Kauvery Hospital',
    location: { type: 'Point', coordinates: [80.2502, 13.0421] },
    emailFrom: 'testotp.hospital@gmail.com',
    smtp: smtpSettings
  },
  {
    name: 'Billroth Hospitals',
    location: { type: 'Point', coordinates: [80.2371, 13.0799] },
    emailFrom: 'testotp.hospital@gmail.com',
    smtp: smtpSettings
  }
];

// ✅ Insert into MongoDB
Hospital.insertMany(hospitalsData)
  .then(() => {
    console.log('✅ Hospitals with location and SMTP added');
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('❌ Error inserting hospitals:', err);
    mongoose.disconnect();
  });
