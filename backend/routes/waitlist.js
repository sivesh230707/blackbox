const express = require('express');
const router = express.Router();

// In-memory waitlist submissions storage
const waitlistSubmissions = [
  {
    id: "wl-001",
    email: "dean.academics@mit.edu",
    submittedAt: "2026-09-04T14:22:00Z",
    institution: "MIT",
    status: "Verified"
  },
  {
    id: "wl-002",
    email: "ece-lab@stanford.edu",
    submittedAt: "2026-09-05T09:15:00Z",
    institution: "Stanford University",
    status: "Pending"
  }
];

// POST /api/waitlist - Submit pilot waitlist interest
router.post('/', (req, res) => {
  const { email, role, institution } = req.body || {};

  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      error: 'A valid institutional or student email address is required.'
    });
  }

  const existing = waitlistSubmissions.find(w => w.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.json({
      success: true,
      message: 'Email is already registered for prototype pilot.',
      data: existing
    });
  }

  const newEntry = {
    id: `wl-${Date.now().toString().slice(-4)}`,
    email: email.trim().toLowerCase(),
    role: role || 'Student / Faculty',
    institution: institution || (email.split('@')[1] || 'Academic Institution'),
    submittedAt: new Date().toISOString(),
    status: 'Received'
  };

  waitlistSubmissions.push(newEntry);
  console.log(`[WAITLIST] New registration received: ${newEntry.email} (${newEntry.institution})`);

  res.status(201).json({
    success: true,
    message: 'Prototype pilot request received successfully.',
    data: newEntry
  });
});

// GET /api/waitlist - List waitlist submissions
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: waitlistSubmissions.length,
    data: waitlistSubmissions
  });
});

module.exports = router;
