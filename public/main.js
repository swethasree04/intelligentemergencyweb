const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

mongoose.connect('mongodb://localhost:27017/hospitals', { useNewUrlParser: true, useUnifiedTopology: true });

const Hospital = mongoose.model('Hospital', new mongoose.Schema({
  name: String,
  location: {
    type: { type: String },
    coordinates: [Number] // [longitude, latitude]
  }
}));

// GeoJSON index
Hospital.collection.createIndex({ location: "2dsphere" });

// API to get hospitals near a location
app.get('/api/hospitals', async (req, res) => {
  const { lat, lng, radius = 500 } = req.query;

  const hospitals = await Hospital.find({
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
        $maxDistance: parseFloat(radius)
      }
    }
  });

  res.json(hospitals);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
