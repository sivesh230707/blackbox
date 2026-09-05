const express = require('express');
const router = express.Router();

// POST /api/chat - Grounded AI Assistant endpoint
router.post('/', (req, res) => {
  const { query, lectureScope } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'A query string is required in the request body.'
    });
  }

  const lower = query.toLowerCase();
  let responseText = '';
  let citations = [
    {
      label: 'Lecture 04 • 19:14',
      time: '19:14',
      source: 'Chalkboard Derivation Section 2'
    }
  ];

  if (lower.includes('mealy') || lower.includes('moore')) {
    responseText = 'In Dr. Ramanathan\'s comparison at 09:30, the primary architectural distinction is that **Mealy outputs depend directly on both present state AND immediate primary inputs**, meaning input glitches can propagate through combinational logic asynchronously.\n\nIn a **Moore machine**, outputs depend exclusively on the current state flip-flops, ensuring glitch-free transitions aligned with the clock edge.';
    citations = [
      { label: 'Lecture 04 • 09:30', time: '09:30', source: 'Mealy vs Moore Timing Diagram' }
    ];
  } else if (lower.includes('jk') || lower.includes('excitation') || lower.includes('flip')) {
    responseText = 'For a JK flip-flop, the excitation table specifies the required inputs $(J, K)$ to achieve a given state transition:\n\n- **0 → 0**: $J = 0, K = X$ (No change / Reset)\n- **0 → 1**: $J = 1, K = X$ (Set / Toggle)\n- **1 → 0**: $J = X, K = 1$ (Reset / Toggle)\n- **1 → 1**: $J = X, K = 0$ (No change / Set)\n\nProf. Ramanathan noted that utilizing the don\'t-care conditions $(X)$ in Karnaugh maps yields minimal SOP logic for synchronous counter control lines.';
    citations = [
      { label: 'Blackboard OCR 18:05', time: '18:05', source: 'JK Excitation Matrix' }
    ];
  } else if (lower.includes('setup') || lower.includes('clock') || lower.includes('frequency') || lower.includes('skew')) {
    responseText = 'The maximum clock frequency $f_{max}$ is governed by the critical path delay:\n\n$$f_{max} \\le \\frac{1}{t_{cq} + t_{comb} + t_{setup}}$$\n\nIf the clock skew $t_{skew}$ across physical board traces exceeds the margin $(t_{cq,min} + t_{logic,min} - t_{hold})$, hold-time race violations will corrupt subsequent register stages.';
    citations = [
      { label: 'Blackboard OCR 39:40', time: '39:40', source: 'Timing Margin Theorem' }
    ];
  } else if (lower.includes('minimization') || lower.includes('merge') || lower.includes('partition')) {
    responseText = 'Based on **Digital Logic Lecture 04 (Captured 10:42 AM)**, states $S_1$ and $S_2$ are equivalent if and only if for every possible input sequence, the outputs generated are identical and the corresponding next states are equivalent:\n\n$$\\lambda(S_1, x) = \\lambda(S_2, x) \\quad \\text{and} \\quad \\delta(S_1, x) \\equiv \\delta(S_2, x) \\quad \\forall x \\in \\Sigma$$\n\nProf explained that when two states produce identical output vectors for all inputs and transition to the same equivalence partition, one can be completely pruned, reducing flip-flop counts from 3 to 2 in the final circuit implementation.';
    citations = [
      { label: 'Lecture 04 • 18:40', time: '18:40', source: 'Partition Refinement Derivation' },
      { label: 'Whiteboard Capture • Slide 14', time: '21:15', source: 'Equivalence Partition Diagram' }
    ];
  } else {
    responseText = `According to **Lecture 04** notes by Prof. Ramanathan, synchronous systems are designed so that all registers trigger simultaneously on the active clock transition. This guarantees deterministic state sequencing and avoids cumulative delay ripple.`;
  }

  res.json({
    success: true,
    data: {
      query,
      lectureScope: lectureScope || 'EE-201: Lecture 04',
      groundingConfidence: '99.1%',
      answer: responseText,
      citations,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  });
});

module.exports = router;
