const express = require('express');
const router = express.Router();
const { quizQuestions, flashcards } = require('../data/store');

// GET /api/quizzes - Get practice quiz questions
router.get('/', (req, res) => {
  // Strip correctKey for fair client testing if desired, or include for immediate grading
  res.json({
    success: true,
    count: quizQuestions.length,
    data: quizQuestions
  });
});

// POST /api/quizzes/verify - Verify student answer and return blackboard grounding
router.post('/verify', (req, res) => {
  const { questionId, selectedKey } = req.body;

  const question = quizQuestions.find(q => q.id === questionId);
  if (!question) {
    return res.status(404).json({ success: false, error: 'Question not found' });
  }

  const isCorrect = question.correctKey === selectedKey;

  res.json({
    success: true,
    data: {
      questionId,
      selectedKey,
      correctKey: question.correctKey,
      isCorrect,
      grounding: question.grounding
    }
  });
});

// GET /api/quizzes/flashcards - Get flashcards with SM-2 intervals
router.get('/flashcards', (req, res) => {
  res.json({
    success: true,
    count: flashcards.length,
    data: flashcards
  });
});

// POST /api/quizzes/flashcards/:id/review - Update SM-2 recall mastery
router.post('/flashcards/:id/review', (req, res) => {
  const { rating } = req.body; // 'hard' | 'good' | 'easy'
  const card = flashcards.find(c => c.id === req.params.id);

  if (!card) {
    return res.status(404).json({ success: false, error: 'Flashcard not found' });
  }

  let nextInterval = 1;
  let newMastery = 'learning';

  if (rating === 'easy') {
    nextInterval = (card.intervalDays || 1) * 2.5;
    newMastery = 'mastered';
  } else if (rating === 'good') {
    nextInterval = (card.intervalDays || 1) * 1.8;
    newMastery = 'learning';
  } else {
    nextInterval = 1;
    newMastery = 'new';
  }

  card.intervalDays = Math.round(nextInterval);
  card.mastery = newMastery;

  res.json({
    success: true,
    data: {
      id: card.id,
      rating,
      mastery: card.mastery,
      intervalDays: card.intervalDays,
      nextReviewDate: new Date(Date.now() + card.intervalDays * 86400000).toISOString().split('T')[0]
    }
  });
});

module.exports = router;
