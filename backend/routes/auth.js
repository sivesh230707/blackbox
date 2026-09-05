const express = require('express');
const router = express.Router();

// Mock in-memory user registry
const users = [
  {
    id: "usr-01",
    email: "student@blackbox.edu",
    username: "student",
    password: "Blackbox123",
    name: "Alex Rivera",
    department: "Electrical & Computer Engineering",
    rollNumber: "ECE-2026-084",
    role: "Student",
    enrolledCourses: ["EE-201", "PHY-104", "CS-210"],
    lastLogin: new Date().toISOString()
  },
  {
    id: "usr-02",
    email: "dean.academics@mit.edu",
    username: "dean.academics",
    password: "Blackbox123",
    name: "Dr. Eleanor Vance",
    department: "Dean of Academic Affairs",
    rollNumber: "FAC-901",
    role: "Faculty",
    enrolledCourses: ["EE-201", "MATH-201"],
    lastLogin: new Date().toISOString()
  }
];

// POST /api/auth/login - Authenticate student or faculty
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Please provide both email/username and password.'
    });
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = users.find(u => 
    u.email.toLowerCase() === cleanEmail || 
    u.username.toLowerCase() === cleanEmail
  );

  // Validate credentials (or allow demo login)
  if (user && user.password === password) {
    user.lastLogin = new Date().toISOString();
    return res.json({
      success: true,
      message: 'Authentication successful. Redirecting to workspace.',
      token: `bb_token_${Date.now()}_${user.id}`,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        rollNumber: user.rollNumber,
        enrolledCourses: user.enrolledCourses
      }
    });
  }

  // Fallback demo convenience: allow student@* with Blackbox123
  if (password === 'Blackbox123' && cleanEmail.includes('@')) {
    const demoUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      email: cleanEmail,
      username: cleanEmail.split('@')[0],
      name: cleanEmail.split('@')[0].toUpperCase(),
      role: 'Student',
      department: 'Computer Science & Engineering',
      rollNumber: 'CS-2026-DEMO',
      enrolledCourses: ["EE-201", "PHY-104"]
    };
    return res.json({
      success: true,
      message: 'Demo credentials accepted. Welcome to Blackbox workspace.',
      token: `bb_token_demo_${Date.now()}`,
      user: demoUser
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Incorrect password or unregistered email.',
    hint: 'Use student@blackbox.edu with password Blackbox123 for pilot access.'
  });
});

// POST /api/auth/register - Register student
router.post('/register', (req, res) => {
  const { email, password, name, department, rollNumber } = req.body || {};

  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      error: 'A valid university or student email is required.'
    });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      error: 'Password must be at least 6 characters.'
    });
  }

  const existing = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (existing) {
    return res.status(409).json({
      success: false,
      error: 'An account with this institutional email already exists.'
    });
  }

  const newUser = {
    id: `usr-${Date.now().toString().slice(-4)}`,
    email: email.trim().toLowerCase(),
    username: email.split('@')[0],
    password,
    name: name || email.split('@')[0],
    department: department || 'Engineering & Computer Science',
    rollNumber: rollNumber || `STD-${Math.floor(1000 + Math.random() * 9000)}`,
    role: 'Student',
    enrolledCourses: ["EE-201", "PHY-104", "CS-210"],
    registeredAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'Student account registered successfully.',
    token: `bb_token_${Date.now()}_${newUser.id}`,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      department: newUser.department,
      rollNumber: newUser.rollNumber,
      enrolledCourses: newUser.enrolledCourses
    }
  });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', (req, res) => {
  const { email } = req.body || {};

  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      error: 'Please enter a valid academic email address.'
    });
  }

  res.json({
    success: true,
    message: `Password reset instructions sent to ${email}. Please check your inbox.`,
    email
  });
});

// GET /api/auth/me - Current user context
router.get('/me', (req, res) => {
  res.json({
    success: true,
    user: users[0]
  });
});

module.exports = router;
