const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');

router.post('/nearby', async (req, res) => {
  const { latitude, longitude } = req.body;

  try {
    const hospitals = await Hospital.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 10000, // 10 km
        }
      }
    });

    res.json(hospitals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch hospitals' });
  }
});

module.exports = router;
