const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const exif = require('exif-parser');

const Otp = require('./server/models/Otp.js');
const Hospital = require('./server/models/hospital.js');
const Emergency = require('./server/models/emergency.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'frontpage')));

// ✅ MongoDB Connection
mongoose.connect('mongodb+srv://swethanehru04:54321@cluster5.rfxoalb.mongodb.net/emergencyDB?retryWrites=true&w=majority&appName=Cluster5')
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ OTP Generator
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ✅ OTP Request Route
app.post("/api/request-otp", async (req, res) => {
  try {
    const { hospitalName, userEmail } = req.body;
    console.log("🔍 OTP request for:", hospitalName, userEmail);

    const hospital = await Hospital.findOne({
      name: { $regex: `^${hospitalName}$`, $options: 'i' }
    });

    if (!hospital) return res.status(404).send("❌ Hospital not found");

    const otp = generateOtp();
    const expires = new Date(Date.now() + 5 * 60 * 1000);
    await Otp.create({ email: userEmail.toLowerCase(), code: otp, expires });

    const transporter = nodemailer.createTransport({
      host: hospital.smtp.host,
      port: hospital.smtp.port,
      secure: hospital.smtp.secure,
      auth: hospital.smtp.auth,
    });

    const mailOptions = {
      from: hospital.emailFrom,
      to: userEmail,
      subject: "Your Emergency OTP Code – Valid for 5 Minutes",
      text: `Your OTP code is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send("✅ OTP sent from hospital to your email.");
  } catch (err) {
    console.error("❌ OTP error:", err);
    res.status(500).send("❌ Failed to send OTP.");
  }
});

// ✅ OTP Verification Route
app.post("/api/verify-otp", async (req, res) => {
  try {
    const { userEmail, code } = req.body;
    const otpRecord = await Otp.findOne({ email: userEmail.toLowerCase(), code });

    if (!otpRecord) return res.status(401).send("❌ Invalid OTP");

    if (otpRecord.expires < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(410).send("❌ OTP expired");
    }

    await Otp.deleteOne({ _id: otpRecord._id });
    res.status(200).send("✅ OTP verified");
  } catch (err) {
    console.error("❌ Verification error:", err);
    res.status(500).send("❌ Failed to verify OTP");
  }
});

// ✅ Save Emergency
app.post("/api/emergency", async (req, res) => {
  try {
    const { signalLocation, direction, vehicleNumber, active } = req.body;
    const emergency = new Emergency({ signalLocation, direction, vehicleNumber, active });
    await emergency.save();
    res.status(201).json({ message: "✅ Emergency recorded" });
  } catch (err) {
    console.error("❌ Emergency error:", err);
    res.status(500).json({ message: "❌ Failed to save emergency" });
  }
});

// ✅ Poll for Emergency by Signal Location
app.get("/api/signal/:location", async (req, res) => {
  try {
    const location = req.params.location;
    const latest = await Emergency.findOne({ signalLocation: location, active: true }).sort({ timestamp: -1 });

    if (!latest) return res.json({ active: false });

    res.json({
      active: true,
      direction: latest.direction,
      vehicleNumber: latest.vehicleNumber,
      timestamp: latest.timestamp,
    });
  } catch (err) {
    console.error("❌ Signal error:", err);
    res.status(500).json({ message: "❌ Failed to fetch signal" });
  }
});

// ✅ Clear Emergency
app.post("/api/clear-emergency", async (req, res) => {
  try {
    const { signalLocation, vehicleNumber } = req.body;
    const result = await Emergency.updateOne(
      { signalLocation: signalLocation.trim(), vehicleNumber: vehicleNumber.trim(), active: true },
      { $set: { active: false } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "❌ No active emergency to clear" });
    }

    res.status(200).json({ message: "✅ Emergency cleared" });
  } catch (err) {
    console.error("❌ Clear error:", err);
    res.status(500).json({ message: "❌ Failed to clear emergency" });
  }
});

// ✅ Upload and Verify Image Metadata
const upload = multer({ dest: 'uploads/' });

app.post("/api/verify-proof", upload.single('proofImage'), (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).send("❌ No file uploaded");

    const fileBuffer = fs.readFileSync(file.path);
    const parser = exif.create(fileBuffer);
    const result = parser.parse();

    const dateTaken = result.tags.DateTimeOriginal || result.tags.CreateDate;
    const deviceModel = (result.tags.Make + " " + result.tags.Model).toLowerCase();
    const validDevices = ["samsung", "apple", "pixel", "nokia", "vivo", "oppo", "xiaomi"];

    let isRecent = false;
    if (dateTaken) {
      const imageDate = new Date(dateTaken * 1000);
      const now = new Date();
      if (Math.abs(now - imageDate) <= 10 * 60 * 1000) {
        isRecent = true;
      }
    }

    if (dateTaken && isRecent && validDevices.some(dev => deviceModel.includes(dev))) {
      return res.send("✅ Your location tracking is turned off.");
    } else {
      return res.send("❌ This proof is not valid. Following action should be taken.");
    }
  } catch (err) {
    console.error("❌ EXIF parse error:", err);
    res.status(500).send("❌ Could not verify image metadata.");
  }
});

// ✅ Get all hospitals (for frontend dropdown)
app.get("/api/hospitals", async (req, res) => {
  try {
    const hospitals = await Hospital.find({}, 'name');
    res.json(hospitals);
  } catch (err) {
    console.error("❌ Failed to fetch hospitals:", err);
    res.status(500).json({ message: "❌ Could not load hospital list" });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
