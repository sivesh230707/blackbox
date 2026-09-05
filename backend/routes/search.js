const express = require('express');
const router = express.Router();

const searchCorpus = [
  {
    id: "sr-01",
    relevance: "98% RELEVANCE",
    score: 98,
    courseCode: "PHY-104",
    courseName: "Engineering Physics",
    lectureTitle: "Engineering Physics — Lecture 02 (Mechanics Foundations)",
    timestamp: "[14:22]",
    snippet: "...in non-inertial reference frames, we introduce fictitious inertial forces before applying F = dp/dt...",
    keywords: ["newton", "second law", "force", "mechanics", "dp/dt", "inertial", "momentum"]
  },
  {
    id: "sr-02",
    relevance: "94% RELEVANCE",
    score: 94,
    courseCode: "PHY-104",
    courseName: "Engineering Physics",
    lectureTitle: "Engineering Physics — Lecture 09 (Rotational Dynamics)",
    timestamp: "[31:05]",
    snippet: "...analogous to F = ma, the rotational form gives torque \\tau = I\\alpha...",
    keywords: ["newton", "f = ma", "rotational", "torque", "alpha", "dynamics", "inertia"]
  },
  {
    id: "sr-03",
    relevance: "89% RELEVANCE",
    score: 89,
    courseCode: "MATH-201",
    courseName: "Mathematics for Engineers",
    lectureTitle: "Mathematics for Engineers — Lecture 05 (Differential Equations)",
    timestamp: "[08:45]",
    snippet: "...second-order linear ODE representing harmonic oscillator derived from Newton's second law...",
    keywords: ["newton", "differential", "ode", "harmonic", "oscillator", "second law"]
  },
  {
    id: "sr-04",
    relevance: "99% RELEVANCE",
    score: 99,
    courseCode: "EE-201",
    courseName: "Digital Logic & Design",
    lectureTitle: "Digital Logic & Design — Lecture 04 (Finite State Machines)",
    timestamp: "[04:12]",
    snippet: "...Mealy machine outputs depend on current state plus present inputs; Moore outputs depend strictly on state register contents...",
    keywords: ["mealy", "moore", "fsm", "state", "machine", "finite", "logic", "digital"]
  },
  {
    id: "sr-05",
    relevance: "96% RELEVANCE",
    score: 96,
    courseCode: "EE-201",
    courseName: "Digital Logic & Design",
    lectureTitle: "Digital Logic & Design — Lecture 04 (Finite State Machines)",
    timestamp: "[18:40]",
    snippet: "...state minimization using partition refinement theorem allows merging identical state equivalence classes...",
    keywords: ["state minimization", "partition", "theorem", "merge", "equivalent", "minimization", "fsm"]
  },
  {
    id: "sr-06",
    relevance: "95% RELEVANCE",
    score: 95,
    courseCode: "EE-201",
    courseName: "Digital Logic & Design",
    lectureTitle: "Digital Logic & Design — Lecture 04 (Finite State Machines)",
    timestamp: "[38:05]",
    snippet: "...JK flip-flop excitation derivation avoids asynchronous ripple hazards in synchronous counter architectures...",
    keywords: ["jk", "flip-flop", "excitation", "synchronous", "counter", "clock", "skew"]
  }
];

// GET /api/search?q=... - Search indexed lecture corpus
router.get('/', (req, res) => {
  const query = (req.query.q || '').trim().toLowerCase();

  if (!query) {
    return res.json({
      success: true,
      query: '',
      count: searchCorpus.slice(0, 3).length,
      data: searchCorpus.slice(0, 3)
    });
  }

  const queryTerms = query.split(/\s+/).filter(Boolean);

  const matched = searchCorpus.filter(item => {
    const itemText = `${item.lectureTitle} ${item.snippet} ${item.keywords.join(' ')}`.toLowerCase();
    return queryTerms.some(term => itemText.includes(term));
  });

  const results = matched.length > 0 ? matched : searchCorpus.slice(0, 3);

  res.json({
    success: true,
    query,
    count: results.length,
    data: results
  });
});

module.exports = router;
