const express = require('express');
const router = express.Router();
const { lectures, topics, transcripts } = require('../data/store');

// GET /api/lectures - List all lectures
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: lectures.length,
    data: lectures
  });
});

// GET /api/lectures/active - Get currently active lecture
router.get('/active', (req, res) => {
  const activeLecture = lectures.find(l => l.isActive) || lectures[0];
  res.json({
    success: true,
    data: activeLecture
  });
});

// GET /api/lectures/:id - Get lecture by ID
router.get('/:id', (req, res) => {
  const lecture = lectures.find(l => l.id === req.params.id);
  if (!lecture) {
    return res.status(404).json({ success: false, error: 'Lecture not found' });
  }
  res.json({ success: true, data: lecture });
});

// GET /api/lectures/:id/topics - Get topic clusters & acoustic timeline scrub
router.get('/:id/topics', (req, res) => {
  const lectureTopics = topics.filter(t => t.lectureId === req.params.id);
  res.json({
    success: true,
    count: lectureTopics.length,
    data: lectureTopics
  });
});

// GET /api/lectures/:id/transcript - Get dual-speaker diarized transcript entries
router.get('/:id/transcript', (req, res) => {
  const lectureTranscripts = transcripts.filter(t => t.lectureId === req.params.id);
  res.json({
    success: true,
    confidence: '99.1%',
    count: lectureTranscripts.length,
    data: lectureTranscripts
  });
});

module.exports = router;
