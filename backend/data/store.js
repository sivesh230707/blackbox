/**
 * In-memory Database Store for Blackbox Student Study Assistant
 */

const telemetryData = {
  nodeId: "NODE-04-B",
  classroom: "Room CS-402 Edge Node",
  status: "Online",
  sampleRate: "48kHz",
  codec: "FLAC (Lossless)",
  channels: "Stereo Array #2 (Clear)",
  speechModel: "Sarvam AI Neural Ingest v3.8",
  languages: ["ENG", "HIN", "TAM"],
  speechConfidence: 0.991,
  blackboardOcrStatus: "Active",
  equationsMapped: 19,
  privacyMode: {
    enabled: true,
    title: "Privacy Mode: Local Processing",
    policy: "100% On-Device Neural Compute • Zero Cloud Leakage",
    hardwareGuard: "Active (Secure Enclave)"
  },
  systemTime: new Date().toISOString()
};

const lectures = [
  {
    id: "ee201-lec04",
    courseCode: "EE-201",
    courseName: "Digital Logic & Design",
    lectureNumber: "Lecture 04",
    title: "Finite State Machines & Synchronous Counters",
    date: "28 Aug 2026",
    durationMinutes: 48,
    professor: "Prof. K. Ramanathan",
    room: "Room CS-402 Edge Node",
    isActive: true,
    summary: {
      executive: "This lecture formalizes synchronous finite state machine (FSM) architectures, contrasting Mealy and Moore machine outputs, and formalizes state minimization using partition refinement algorithms. Synchronous 3-bit up/down counter design is derived with JK flip-flops to completely eliminate cumulative propagation delays inherent in asynchronous ripple counters.",
      synthesisSpeed: "1.4s",
      takeaways: [
        {
          title: "Mealy vs Moore Outputs",
          description: "Mealy outputs depend on current state & immediate inputs (asynchronous glitches possible); Moore outputs depend strictly on the present state registers."
        },
        {
          title: "JK Inversion Synthesis",
          description: "Excitation mapping yields J=1, K=1 for toggle transitions, directly resolving next-state count logic without race hazards."
        },
        {
          title: "Clock Skew Timing Hazard",
          description: "Maximum clock frequency is strictly constrained by setup delay t_setup and combinational propagation t_comb."
        }
      ]
    }
  },
  {
    id: "phy104-lec02",
    courseCode: "PHY-104",
    courseName: "Engineering Physics",
    lectureNumber: "Lecture 02",
    title: "Electromagnetic Wave Propagation & Maxwell Equations",
    date: "26 Aug 2026",
    durationMinutes: 52,
    professor: "Dr. Ananya Sen",
    room: "Hall 101",
    isActive: false
  },
  {
    id: "cs210-lec06",
    courseCode: "CS-210",
    courseName: "Data Structures & Algorithms",
    lectureNumber: "Lecture 06",
    title: "Balanced Binary Search Trees & AVL Rotations",
    date: "25 Aug 2026",
    durationMinutes: 50,
    professor: "Dr. Rajesh Iyer",
    room: "Lab B-02",
    isActive: false
  }
];

const topics = [
  {
    id: "t1",
    lectureId: "ee201-lec04",
    time: "00:04",
    seconds: 4,
    title: "Introduction & Review of Flip-Flops",
    subtitle: "SR, D, and T latches vs edge-triggered registers"
  },
  {
    id: "t2",
    lectureId: "ee201-lec04",
    time: "08:32",
    seconds: 512,
    title: "Finite State Machines: Mealy vs Moore Architecture",
    subtitle: "Asynchronous glitch propagation and timing diagrams"
  },
  {
    id: "t3",
    lectureId: "ee201-lec04",
    time: "19:14",
    seconds: 1154,
    title: "State Transition Diagrams & Excitation Tables",
    subtitle: "Mapping state vectors to transition truth tables"
  },
  {
    id: "t4",
    lectureId: "ee201-lec04",
    time: "31:40",
    seconds: 1900,
    title: "Synchronous Counters Design & JK Minimization",
    subtitle: "Karnaugh mapping for 3-bit up/down count registers"
  },
  {
    id: "t5",
    lectureId: "ee201-lec04",
    time: "42:15",
    seconds: 2535,
    title: "Exam-Important Derivations & Setup Time Violations",
    subtitle: "High frequency limits, t_cq delays, and clock tree routing"
  }
];

const keyConcepts = [
  {
    id: "c1",
    lectureId: "ee201-lec04",
    title: "Finite State Machine (FSM)",
    tag: "Core",
    definition: "A mathematical model of computation composed of finite states, inputs, and a transition logic function."
  },
  {
    id: "c2",
    lectureId: "ee201-lec04",
    title: "State Transition Logic",
    tag: "Circuitry",
    definition: "Combinational network evaluating the active input and present state flip-flop vector to synthesize next states."
  },
  {
    id: "c3",
    lectureId: "ee201-lec04",
    title: "Synchronous Counter",
    tag: "Hardware",
    definition: "Digital counter where clock pulses arrive concurrently at every storage element, avoiding cumulative ripple delay."
  },
  {
    id: "c4",
    lectureId: "ee201-lec04",
    title: "Mealy vs Moore Output",
    tag: "Theory",
    definition: "Moore depends exclusively on current state registers; Mealy depends on current state plus immediate primary inputs."
  },
  {
    id: "c5",
    lectureId: "ee201-lec04",
    title: "Excitation Table",
    tag: "Synthesis",
    definition: "Reference matrix listing required flip-flop input signals (J, K) for each specified state transition (0→0, 0→1, 1→0, 1→1)."
  },
  {
    id: "c6",
    lectureId: "ee201-lec04",
    title: "Clock Skew & Setup Delay",
    tag: "Timing",
    definition: "Spatial divergence in clock edge arrival causing timing margin violations and metastability states."
  }
];

const formulas = [
  {
    id: "f1",
    lectureId: "ee201-lec04",
    title: "JK Flip-Flop Characteristic Equation",
    latex: "Q_{next} = J \\cdot \\overline{Q} + \\overline{K} \\cdot Q",
    displayMath: "Q_{next} = J · Q̅ + K̅ · Q",
    source: "Blackboard OCR 24:15",
    module: "Module 2.3",
    description: "Defines next output state based on active excitation inputs and current feedback state."
  },
  {
    id: "f2",
    lectureId: "ee201-lec04",
    title: "Maximum Clock Frequency Bound",
    latex: "f_{max} \\le \\frac{1}{t_{cq} + t_{comb} + t_{setup}}",
    displayMath: "f_{max} ≤ 1 / (t_{cq} + t_{comb} + t_{setup})",
    source: "Blackboard OCR 39:40",
    module: "Module 4.1",
    description: "Upper boundary constraint for synchronous operation before propagation delays violate setup margins."
  },
  {
    id: "f3",
    lectureId: "ee201-lec04",
    title: "Hold Time & Clock Skew Condition",
    latex: "t_{skew} < t_{cq,min} + t_{logic,min} - t_{hold}",
    displayMath: "t_{skew} < t_{cq,min} + t_{logic,min} - t_{hold}",
    source: "Blackboard OCR 44:12",
    module: "Module 4.2",
    description: "Ensures data output does not propagate into downstream registers before hold time requirements expire."
  },
  {
    id: "f4",
    lectureId: "ee201-lec04",
    title: "JK Flip-Flop Excitation Mapping",
    latex: "\\begin{matrix} Q(t) \\to Q(t+1) & J & K \\\\ 0 \\to 0 & 0 & X \\\\ 0 \\to 1 & 1 & X \\\\ 1 \\to 0 & X & 1 \\\\ 1 \\to 1 & X & 0 \\end{matrix}",
    displayMath: "0→0: [J=0, K=X] | 0→1: [J=1, K=X] | 1→0: [J=X, K=1] | 1→1: [J=X, K=0]",
    source: "Blackboard OCR 18:05",
    module: "Module 3.1",
    description: "Excitation truth vector for state transitions used directly in Karnaugh map logic optimization."
  }
];

const transcripts = [
  {
    id: "tr1",
    lectureId: "ee201-lec04",
    time: "12:42",
    speaker: "PROFESSOR (DR. RAMANATHAN)",
    role: "professor",
    text: "Today we are going to understand how state transitions are synchronized by a single master clock pulse. Look at this diagram on the central blackboard: unlike asynchronous systems where the flip-flop output feeds the clock pin of the successive stage, here every flip-flop triggers in parallel."
  },
  {
    id: "tr2",
    lectureId: "ee201-lec04",
    time: "13:18",
    speaker: "STUDENT QUESTION",
    role: "student",
    isQuestion: true,
    text: "Sir, why do we use synchronous counters here instead of ripple counters? Aren't ripple counters much simpler to build with fewer logic gates?"
  },
  {
    id: "tr3",
    lectureId: "ee201-lec04",
    time: "13:30",
    speaker: "PROFESSOR (DR. RAMANATHAN)",
    role: "professor",
    text: "In a ripple counter, propagation delays accumulate across flip-flops. For an n-bit counter, the cumulative delay is n × t_pd. If you have 8 stages, your settling time ruins high-speed operations. In synchronous designs, all clock inputs receive the trigger simultaneously, eliminating ripple lag completely."
  }
];

const quizQuestions = [
  {
    id: "q1",
    lectureId: "ee201-lec04",
    topic: "Synchronous vs Asynchronous Topology",
    question: "Which type of counter triggers state changes across all storage flip-flops simultaneously via a single master clock edge?",
    options: [
      {
        key: "A",
        label: "A. Ripple Counter (Asynchronous)",
        description: "Flip-flop outputs cascade into subsequent clock inputs consecutively."
      },
      {
        key: "B",
        label: "B. Synchronous Counter (Parallel Clocked)",
        description: "All clock pins share an identical clock distribution line in parallel."
      },
      {
        key: "C",
        label: "C. Ring Counter",
        description: "Shift register with the output of the last flip-flop looped directly to the first."
      },
      {
        key: "D",
        label: "D. Johnson Counter",
        description: "Twisted-ring topology feeding inverse of the terminal stage back to stage zero."
      }
    ],
    correctKey: "B",
    grounding: {
      timestamp: "31:42",
      confidence: "99.4% Match",
      quote: "In synchronous designs, all clock pins receive the trigger pulse in parallel, eliminating cumulative t_pd ripple delay. The trade-off is higher fan-out requirements on the clock buffer tree.",
      instructorNote: "Instructor: Prof. Ramanathan • Board Segment 03"
    }
  },
  {
    id: "q2",
    lectureId: "ee201-lec04",
    topic: "FSM Architectures",
    question: "In a Mealy machine, what determines the primary output values at any given instant?",
    options: [
      {
        key: "A",
        label: "A. Current state flip-flop registers only",
        description: "Outputs change strictly on active clock transitions."
      },
      {
        key: "B",
        label: "B. Both current state registers and immediate primary inputs",
        description: "Input spikes can propagate asynchronously to output lines."
      },
      {
        key: "C",
        label: "C. Only external primary inputs",
        description: "Pure combinational function with zero state dependence."
      },
      {
        key: "D",
        label: "D. Next state flip-flop excitation values",
        description: "Evaluated before next clock edge triggers."
      }
    ],
    correctKey: "B",
    grounding: {
      timestamp: "09:15",
      confidence: "98.8% Match",
      quote: "Mealy outputs depend on current state plus external inputs. If an input changes between clock edges, the Mealy output can glitch immediately before the next clock pulse.",
      instructorNote: "Instructor: Prof. Ramanathan • Board Segment 01"
    }
  }
];

const flashcards = [
  {
    id: "fc1",
    lectureId: "ee201-lec04",
    front: "Why do synchronous counters eliminate glitch states compared to ripple counters?",
    back: "Because all clock pins trigger from a single master clock in parallel. Flip-flop propagation delays do not accumulate sequentially, preventing transient intermediate count values.",
    tag: "Synchronous Logic",
    mastery: "mastered",
    intervalDays: 7
  },
  {
    id: "fc2",
    lectureId: "ee201-lec04",
    front: "What is the characteristic equation for a JK Flip-Flop?",
    back: "Q_next = J · Q̅ + K̅ · Q. When J=1 and K=1, the flip-flop toggles its output state on each clock edge.",
    tag: "Flip-Flops",
    mastery: "learning",
    intervalDays: 3
  },
  {
    id: "fc3",
    lectureId: "ee201-lec04",
    front: "What is the condition to prevent clock skew hold-time violations?",
    back: "t_skew < t_cq,min + t_logic,min - t_hold. The minimum signal transit path must exceed the clock skew plus hold time requirement.",
    tag: "Timing Analysis",
    mastery: "new",
    intervalDays: 1
  }
];

module.exports = {
  telemetryData,
  lectures,
  topics,
  keyConcepts,
  formulas,
  transcripts,
  quizQuestions,
  flashcards
};
