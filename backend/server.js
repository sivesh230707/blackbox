const express = require('express');
const cors = require('cors');

const telemetryRoutes = require('./routes/telemetry');
const lectureRoutes = require('./routes/lectures');
const notesRoutes = require('./routes/notes');
const formulaRoutes = require('./routes/formulas');
const quizRoutes = require('./routes/quizzes');
const chatRoutes = require('./routes/chat');
const waitlistRoutes = require('./routes/waitlist');
const searchRoutes = require('./routes/search');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'blackbox-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/formulas', formulaRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/waitlist', waitlistRoutes);
app.use('/api/search', searchRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Blackbox AI Hardware Backend API',
    description: 'REST API service powering lecture capture, telemetry, notes, formulas, quizzes, and grounded study assistant.',
    documentation: '/api/health',
    availableEndpoints: [
      '/api/health',
      '/api/telemetry',
      '/api/lectures',
      '/api/lectures/active',
      '/api/lectures/:id/topics',
      '/api/lectures/:id/transcript',
      '/api/notes/:id/summary',
      '/api/notes/:id/concepts',
      '/api/formulas',
      '/api/formulas/calculate-fmax (POST)',
      '/api/quizzes',
      '/api/quizzes/verify (POST)',
      '/api/quizzes/flashcards',
      '/api/quizzes/flashcards/:id/review (POST)',
      '/api/chat (POST)'
    ]
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: err.message
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 Blackbox Backend Server running on port ${PORT}`);
  console.log(`📡 Local:   http://localhost:${PORT}/`);
  console.log(`🔍 Health:  http://localhost:${PORT}/api/health`);
  console.log(`📊 Node 04: http://localhost:${PORT}/api/telemetry`);
  console.log(`====================================================`);
});
