const express = require('express');
const router = express.Router();
const { lectures, keyConcepts } = require('../data/store');

// GET /api/notes/:lectureId/summary - Get executive smart summary
router.get('/:lectureId/summary', (req, res) => {
  const lecture = lectures.find(l => l.id === req.params.lectureId);
  if (!lecture || !lecture.summary) {
    return res.status(404).json({ success: false, error: 'Summary not found' });
  }
  res.json({
    success: true,
    data: lecture.summary
  });
});

// GET /api/notes/:lectureId/concepts - Get categorized key concepts
router.get('/:lectureId/concepts', (req, res) => {
  const concepts = keyConcepts.filter(c => c.lectureId === req.params.lectureId);
  res.json({
    success: true,
    count: concepts.length,
    data: concepts
  });
});

module.exports = router;
