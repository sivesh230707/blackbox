const express = require('express');
const router = express.Router();
const { telemetryData } = require('../data/store');

// GET /api/telemetry
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      ...telemetryData,
      systemTime: new Date().toISOString()
    }
  });
});

module.exports = router;
