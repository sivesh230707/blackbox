export interface LectureTopic {
  id: string;
  time: string;
  seconds: number;
  title: string;
  subtitle: string;
}

export interface KeyConcept {
  id: string;
  title: string;
  tag: string;
  definition: string;
  source?: string;
}

export interface FormulaItem {
  id: string;
  title: string;
  latex: string;
  displayMath: string;
  source: string;
  module: string;
  description: string;
}

export interface TranscriptEntry {
  id: string;
  time: string;
  speaker: string;
  role: 'professor' | 'student';
  text: string;
  isQuestion?: boolean;
}

export interface QuizQuestion {
  id: string;
  topic: string;
  question: string;
  options: {
    key: string;
    label: string;
    description: string;
  }[];
  correctKey: string;
  grounding: {
    timestamp: string;
    confidence: string;
    quote: string;
    instructorNote: string;
  };
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  tag: string;
  mastery: 'new' | 'learning' | 'mastered';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  citations?: {
    label: string;
    time: string;
    source: string;
  }[];
}

export const LECTURE_METADATA = {
  courseCode: 'EE-201',
  courseName: 'Digital Logic & Design',
  lectureNumber: 'Lecture 04',
  title: 'Finite State Machines & Synchronous Counters',
  date: '28 Aug 2026',
  duration: '48 min',
  professor: 'Prof. K. Ramanathan',
  room: 'Room CS-402 Edge Node (Stereo Ingest)',
  engine: 'Sarvam AI Neural Ingest v3.8 (ENG • HIN • TAM)',
  confidence: '99.1%',
  privacyMode: 'Privacy Mode: Local Processing',
  privacySubtitle: '100% On-Device • Zero Cloud Leakage • Edge Node 04'
};

export const TOPICS: LectureTopic[] = [
  {
    id: 't1',
    time: '00:04',
    seconds: 4,
    title: 'Introduction & Review of Flip-Flops',
    subtitle: 'SR, D, and T latches vs edge-triggered registers'
  },
  {
    id: 't2',
    time: '08:32',
    seconds: 512,
    title: 'Finite State Machines: Mealy vs Moore Architecture',
    subtitle: 'Asynchronous glitch propagation and timing diagrams'
  },
  {
    id: 't3',
    time: '19:14',
    seconds: 1154,
    title: 'State Transition Diagrams & Excitation Tables',
    subtitle: 'Mapping state vectors to transition truth tables'
  },
  {
    id: 't4',
    time: '31:40',
    seconds: 1900,
    title: 'Synchronous Counters Design & JK Minimization',
    subtitle: 'Karnaugh mapping for 3-bit up/down count registers'
  },
  {
    id: 't5',
    time: '42:15',
    seconds: 2535,
    title: 'Exam-Important Derivations & Setup Time Violations',
    subtitle: 'High frequency limits, t_cq delays, and clock tree routing'
  }
];

export const KEY_CONCEPTS: KeyConcept[] = [
  {
    id: 'c1',
    title: 'Finite State Machine (FSM)',
    tag: 'Core',
    definition: 'A mathematical model of computation composed of finite states, inputs, and a transition logic function.'
  },
  {
    id: 'c2',
    title: 'State Transition Logic',
    tag: 'Circuitry',
    definition: 'Combinational network evaluating the active input and present state flip-flop vector to synthesize next states.'
  },
  {
    id: 'c3',
    title: 'Synchronous Counter',
    tag: 'Hardware',
    definition: 'Digital counter where clock pulses arrive concurrently at every storage element, avoiding cumulative ripple delay.'
  },
  {
    id: 'c4',
    title: 'Mealy vs Moore Output',
    tag: 'Theory',
    definition: 'Moore depends exclusively on current state registers; Mealy depends on current state plus immediate primary inputs.'
  },
  {
    id: 'c5',
    title: 'Excitation Table',
    tag: 'Synthesis',
    definition: 'Reference matrix listing required flip-flop input signals (J, K) for each specified state transition (0→0, 0→1, 1→0, 1→1).'
  },
  {
    id: 'c6',
    title: 'Clock Skew & Setup Delay',
    tag: 'Timing',
    definition: 'Spatial divergence in clock edge arrival causing timing margin violations and metastability states.'
  }
];

export const FORMULAS: FormulaItem[] = [
  {
    id: 'f1',
    title: 'JK Flip-Flop Characteristic Equation',
    latex: 'Q_{next} = J \\cdot \\overline{Q} + \\overline{K} \\cdot Q',
    displayMath: 'Q_{next} = J · Q̅ + K̅ · Q',
    source: 'Blackboard OCR 24:15',
    module: 'Module 2.3',
    description: 'Defines next output state based on active excitation inputs and current feedback state.'
  },
  {
    id: 'f2',
    title: 'Maximum Clock Frequency Bound',
    latex: 'f_{max} \\le \\frac{1}{t_{cq} + t_{comb} + t_{setup}}',
    displayMath: 'f_{max} ≤ 1 / (t_{cq} + t_{comb} + t_{setup})',
    source: 'Blackboard OCR 39:40',
    module: 'Module 4.1',
    description: 'Upper boundary constraint for synchronous operation before propagation delays violate setup margins.'
  },
  {
    id: 'f3',
    title: 'Hold Time & Clock Skew Condition',
    latex: 't_{skew} < t_{cq,min} + t_{logic,min} - t_{hold}',
    displayMath: 't_{skew} < t_{cq,min} + t_{logic,min} - t_{hold}',
    source: 'Blackboard OCR 44:12',
    module: 'Module 4.2',
    description: 'Ensures data output does not propagate into downstream registers before hold time requirements expire.'
  },
  {
    id: 'f4',
    title: 'JK Flip-Flop Excitation Mapping',
    latex: '\\begin{matrix} Q(t) \\to Q(t+1) & J & K \\\\ 0 \\to 0 & 0 & X \\\\ 0 \\to 1 & 1 & X \\\\ 1 \\to 0 & X & 1 \\\\ 1 \\to 1 & X & 0 \\end{matrix}',
    displayMath: '0→0: [J=0, K=X] | 0→1: [J=1, K=X] | 1→0: [J=X, K=1] | 1→1: [J=X, K=0]',
    source: 'Blackboard OCR 18:05',
    module: 'Module 3.1',
    description: 'Excitation truth vector for state transitions used directly in Karnaugh map logic optimization.'
  }
];

export const TRANSCRIPTS: TranscriptEntry[] = [
  {
    id: 'tr1',
    time: '12:42',
    speaker: 'PROFESSOR (DR. RAMANATHAN)',
    role: 'professor',
    text: 'Today we are going to understand how state transitions are synchronized by a single master clock pulse. Look at this diagram on the central blackboard: unlike asynchronous systems where the flip-flop output feeds the clock pin of the successive stage, here every flip-flop triggers in parallel.'
  },
  {
    id: 'tr2',
    time: '13:18',
    speaker: 'STUDENT QUESTION',
    role: 'student',
    isQuestion: true,
    text: "Sir, why do we use synchronous counters here instead of ripple counters? Aren't ripple counters much simpler to build with fewer logic gates?"
  },
  {
    id: 'tr3',
    time: '13:30',
    speaker: 'PROFESSOR (DR. RAMANATHAN)',
    role: 'professor',
    text: 'In a ripple counter, propagation delays accumulate across flip-flops. For an n-bit counter, the cumulative delay is n × t_pd. If you have 8 stages, your settling time ruins high-speed operations. In synchronous designs, all clock inputs receive the trigger simultaneously, eliminating ripple lag completely.'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    topic: 'Synchronous vs Asynchronous Topology',
    question: 'Which type of counter triggers state changes across all storage flip-flops simultaneously via a single master clock edge?',
    options: [
      {
        key: 'A',
        label: 'A. Ripple Counter (Asynchronous)',
        description: 'Flip-flop outputs cascade into subsequent clock inputs consecutively.'
      },
      {
        key: 'B',
        label: 'B. Synchronous Counter (Parallel Clocked)',
        description: 'All clock pins share an identical clock distribution line in parallel.'
      },
      {
        key: 'C',
        label: 'C. Ring Counter',
        description: 'Shift register with the output of the last flip-flop looped directly to the first.'
      },
      {
        key: 'D',
        label: 'D. Johnson Counter',
        description: 'Twisted-ring topology feeding inverse of the terminal stage back to stage zero.'
      }
    ],
    correctKey: 'B',
    grounding: {
      timestamp: '31:42',
      confidence: '99.4% Match',
      quote: 'In synchronous designs, all clock pins receive the trigger pulse in parallel, eliminating cumulative t_pd ripple delay. The trade-off is higher fan-out requirements on the clock buffer tree.',
      instructorNote: 'Instructor: Prof. Ramanathan • Board Segment 03'
    }
  },
  {
    id: 'q2',
    topic: 'FSM Architectures',
    question: 'In a Mealy machine, what determines the primary output values at any given instant?',
    options: [
      {
        key: 'A',
        label: 'A. Current state flip-flop registers only',
        description: 'Outputs change strictly on active clock transitions.'
      },
      {
        key: 'B',
        label: 'B. Both current state registers and immediate primary inputs',
        description: 'Input spikes can propagate asynchronously to output lines.'
      },
      {
        key: 'C',
        label: 'C. Only external primary inputs',
        description: 'Pure combinational function with zero state dependence.'
      },
      {
        key: 'D',
        label: 'D. Next state flip-flop excitation values',
        description: 'Evaluated before next clock edge triggers.'
      }
    ],
    correctKey: 'B',
    grounding: {
      timestamp: '09:15',
      confidence: '98.8% Match',
      quote: 'Mealy outputs depend on current state plus external inputs. If an input changes between clock edges, the Mealy output can glitch immediately before the next clock pulse.',
      instructorNote: 'Instructor: Prof. Ramanathan • Board Segment 01'
    }
  }
];

export const FLASHCARDS: Flashcard[] = [
  {
    id: 'fc1',
    front: 'Why do synchronous counters eliminate glitch states compared to ripple counters?',
    back: 'Because all clock pins trigger from a single master clock in parallel. Flip-flop propagation delays do not accumulate sequentially, preventing transient intermediate count values.',
    tag: 'Synchronous Logic',
    mastery: 'mastered'
  },
  {
    id: 'fc2',
    front: 'What is the characteristic equation for a JK Flip-Flop?',
    back: 'Q_next = J · Q̅ + K̅ · Q. When J=1 and K=1, the flip-flop toggles its output state on each clock edge.',
    tag: 'Flip-Flops',
    mastery: 'learning'
  },
  {
    id: 'fc3',
    front: 'What is the condition to prevent clock skew hold-time violations?',
    back: 't_skew < t_cq,min + t_logic,min - t_hold. The minimum signal transit path must exceed the clock skew plus hold time requirement.',
    tag: 'Timing Analysis',
    mastery: 'new'
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'user',
    text: 'Explain why synchronous counters are preferred over ripple counters, and how propagation delay causes glitching.',
    timestamp: '10:42 AM'
  },
  {
    id: 'm2',
    sender: 'ai',
    text: 'Synchronous counters are preferred for high-speed digital systems because **all flip-flops share a single master clock** in parallel, eliminating cumulative propagation delay.\n\nIn contrast, in an asynchronous **ripple counter**:\n- Stage 0 toggles, taking delay $t_{pd}$.\n- Stage 1 clocks only after Stage 0 settles ($2 \\times t_{pd}$).\n- For an $n$-bit counter, cumulative delay is $n \\times t_{pd}$.\n\nDuring this transition interval, the counter outputs briefly pass through spurious intermediate values (e.g., transitioning from $011_2 \\to 100_2$ may momentarily glitch through $010_2$ and $000_2$), triggering false glitches in downstream combinational logic.',
    timestamp: '10:42 AM',
    citations: [
      {
        label: 'Lecture 04 • 13:30',
        time: '13:30',
        source: 'Prof. Ramanathan blackboard derivation'
      },
      {
        label: 'Board OCR 31:42',
        time: '31:42',
        source: 'Synchronous clock tree diagram'
      }
    ]
  }
];
