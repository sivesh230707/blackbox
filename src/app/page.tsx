'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  // 1. Live Telemetry from Backend
  const [telemetry, setTelemetry] = useState<{
    nodeId?: string;
    classroom?: string;
    status?: string;
    speechConfidence?: number;
  }>({
    nodeId: 'NODE-04-B',
    classroom: 'Room CS-402',
    status: 'Operational',
    speechConfidence: 0.991
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/telemetry')
      .then(res => res.json())
      .then(data => {
        if (data && data.success) {
          setTelemetry(data.data);
        }
      })
      .catch(() => {
        // graceful offline fallback
      });
  }, []);

  // 2. Interactive Preview State
  const [activePreviewTab, setActivePreviewTab] = useState<'summary' | 'formulas' | 'concepts' | 'flashcards'>('summary');
  const [copiedFormula, setCopiedFormula] = useState(false);
  const [activeConceptIdx, setActiveConceptIdx] = useState<number | null>(0);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const concepts = [
    { title: 'Mealy vs Moore', desc: 'Mealy outputs depend on current state & present inputs; Moore outputs depend strictly on state registers.' },
    { title: 'State Transitions', desc: 'Formal state diagram mapping excitation inputs to next-state synchronous register values.' },
    { title: 'Clock Skew Mitigation', desc: 'Clock routing delay variations across traces must not exceed hold time margins.' },
    { title: 'Setup & Hold Time', desc: 'T_setup: data must remain stable prior to clock edge; T_hold: data must remain stable after clock edge.' },
    { title: 'Partition Theorem', desc: 'Merges redundant states that generate identical outputs and enter identical equivalence classes.' },
    { title: 'JK Excitation', desc: 'Inputs required to achieve specific 0->0, 0->1, 1->0, 1->1 transitions without race hazards.' }
  ];

  const flashcards = [
    {
      id: 1,
      q: 'What is the primary difference between a Mealy machine and a Moore machine?',
      a: 'Mealy outputs depend on BOTH current state and immediate primary inputs. Moore outputs depend EXCLUSIVELY on current state register contents.'
    },
    {
      id: 2,
      q: 'What excitation inputs (J, K) cause a toggle transition (1 -> 0) in a JK flip-flop?',
      a: 'J = X (Don\'t Care), K = 1.'
    },
    {
      id: 3,
      q: 'What is the setup-time timing constraint for maximum operating clock frequency?',
      a: 'T_clk >= T_cq + T_comb + T_setup. Frequency f_max <= 1 / (T_cq + T_comb + T_setup).'
    }
  ];

  const handleCopyFormula = (latex: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(latex);
      setCopiedFormula(true);
      setTimeout(() => setCopiedFormula(false), 2000);
    }
  };

  // 3. Interactive Cross-Lecture Search State
  const [searchQuery, setSearchQuery] = useState("Where did the professor explain Newton's Second Law?");
  const [searchResults, setSearchResults] = useState<any[]>([
    {
      id: 'sr-01',
      relevance: '98% RELEVANCE',
      courseName: 'Engineering Physics',
      lectureTitle: 'Engineering Physics — Lecture 02 (Mechanics Foundations)',
      timestamp: '[14:22]',
      snippet: '...in non-inertial reference frames, we introduce fictitious inertial forces before applying F = dp/dt...'
    },
    {
      id: 'sr-02',
      relevance: '94% RELEVANCE',
      courseName: 'Engineering Physics',
      lectureTitle: 'Engineering Physics — Lecture 09 (Rotational Dynamics)',
      timestamp: '[31:05]',
      snippet: '...analogous to F = ma, the rotational form gives torque \\tau = I\\alpha...'
    },
    {
      id: 'sr-03',
      relevance: '89% RELEVANCE',
      courseName: 'Mathematics for Engineers',
      lectureTitle: 'Mathematics for Engineers — Lecture 05 (Differential Equations)',
      timestamp: '[08:45]',
      snippet: "...second-order linear ODE representing harmonic oscillator derived from Newton's second law..."
    }
  ]);
  const [isSearching, setIsSearching] = useState(false);

  const executeSearch = (q: string) => {
    setIsSearching(true);
    fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(q)}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.success && data.data) {
          setSearchResults(data.data);
        }
      })
      .catch(() => {
        // Fallback to internal search
      })
      .finally(() => {
        setIsSearching(false);
      });
  };

  // 4. Interactive Lecture-Grounded AI Q&A State
  const [qaInput, setQaInput] = useState("Explain the state minimization theorem discussed in today's lecture and when we can merge states.");
  const [qaLoading, setQaLoading] = useState(false);
  const [qaResponse, setQaResponse] = useState<{
    answer: string;
    citations: { label: string; time: string; source: string }[];
    latency: string;
  }>({
    answer: "Based on **Digital Logic Lecture 04 (Captured 10:42 AM)**, states $S_1$ and $S_2$ are equivalent if and only if for every possible input sequence, the outputs generated are identical and the corresponding next states are equivalent.\n\nProf explained that when two states produce identical output vectors for all inputs and transition to the same equivalence partition, one can be completely pruned, reducing flip-flop counts from 3 to 2 in the final circuit implementation.",
    citations: [
      { label: 'Lecture 04 • 18:40', time: '18:40', source: 'Partition Refinement Derivation' },
      { label: 'Whiteboard Capture • Slide 14', time: '21:15', source: 'Equivalence Partition Diagram' }
    ],
    latency: '380ms'
  });

  const handleAskTutor = (queryText?: string) => {
    const q = queryText || qaInput;
    if (!q.trim()) return;
    setQaLoading(true);
    const start = Date.now();

    fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: q, lectureScope: 'EE-201: Lecture 04' })
    })
      .then(res => res.json())
      .then(data => {
        const duration = Date.now() - start;
        if (data && data.success && data.data) {
          setQaResponse({
            answer: data.data.answer,
            citations: data.data.citations || [],
            latency: `${duration}ms`
          });
        }
      })
      .catch(() => {
        // fallback
      })
      .finally(() => {
        setQaLoading(false);
      });
  };

  // 5. Functional Waitlist State
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [waitlistMsg, setWaitlistMsg] = useState('Prototype pilot request received.');

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail || !waitlistEmail.includes('@')) return;

    setWaitlistLoading(true);
    fetch('http://localhost:5000/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: waitlistEmail })
    })
      .then(res => res.json())
      .then(data => {
        setWaitlistSubmitted(true);
        if (data && data.message) {
          setWaitlistMsg(data.message);
        }
      })
      .catch(() => {
        setWaitlistSubmitted(true);
      })
      .finally(() => {
        setWaitlistLoading(false);
      });
  };

  return (
    <div className="w-full bg-background font-sans text-on-surface antialiased">
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-border-subtle shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
        <div className="h-20 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link className="flex items-center group transition-opacity hover:opacity-90" href="/">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0b1c30] flex items-center justify-center text-white shadow-sm ring-1 ring-black/5">
                  <div className="flex items-center gap-0.5">
                    <span className="w-1 h-3 bg-indigo-400 rounded-full animate-pulse"></span>
                    <span className="w-1 h-4 bg-white rounded-full"></span>
                    <span className="w-1 h-2 bg-indigo-300 rounded-full"></span>
                  </div>
                </div>
                <span className="font-extrabold text-xl tracking-tight text-slate-950 font-mono">
                  BLACKBOX
                </span>
              </div>
            </Link>
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-surface-tint border border-border-strong/60">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-mono text-[11px] font-semibold tracking-wider text-slate-700 uppercase">
                {telemetry.nodeId || 'Edge Ingestion Active'} • {telemetry.status || 'Online'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 py-1">
            <Link 
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-primary text-white font-sans text-xs sm:text-sm font-semibold hover:bg-primary-hover shadow-sm hover:shadow-[0_4px_16px_rgba(37,99,235,0.28)] transition-all" 
              href="/dashboard"
            >
              <span>Launch Workspace</span>
              <span className="material-symbols-outlined ml-1.5 text-[16px]">arrow_forward</span>
            </Link>
            <Link 
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-surface-subtle text-slate-900 border border-border-strong hover:bg-white hover:border-primary hover:text-primary font-sans text-xs sm:text-sm font-semibold shadow-xs transition-all" 
              href="/dashboard"
            >
              <span>Student Login</span>
              <span className="material-symbols-outlined ml-1.5 text-[16px]">login</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full pt-20">
        {/* 1. HERO SECTION (TWO-PART LAYOUT) */}
        <section className="relative w-full border-b border-border-subtle bg-gradient-to-b from-surface-tint/60 via-background to-white overflow-hidden py-16 lg:py-24">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Hero Left Column */}
              <div className="lg:col-span-6 flex flex-col items-start text-left">
                {/* Tech label badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-border-strong/70 shadow-xs mb-6">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                  <span className="font-mono text-[11px] font-semibold text-slate-800 tracking-wider uppercase">
                    AUTONOMOUS LECTURE CAPTURE → AI STUDY COMPANION
                  </span>
                </div>
                {/* Authoritative Headline */}
                <h1 className="font-sans text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-slate-950 tracking-tight leading-[1.08] mb-6">
                  Turn Every Lecture Into Study-Ready Knowledge.
                </h1>
                {/* Supporting Description */}
                <p className="font-sans text-lg text-slate-600 max-w-xl leading-relaxed mb-8">
                  BLACKBOX autonomously captures classroom lectures and transforms them into structured, searchable study material.
                </p>
                {/* Buttons Group */}
                <div className="flex flex-wrap items-center gap-3.5 mb-10 w-full sm:w-auto">
                  <Link 
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-primary text-white font-sans text-sm font-semibold hover:bg-primary-hover shadow-sm hover:shadow-[0_4px_16px_rgba(37,99,235,0.25)] transition-all" 
                    href="/dashboard"
                  >
                    <span>Explore BLACKBOX</span>
                    <span className="material-symbols-outlined ml-2 text-[18px]">arrow_forward</span>
                  </Link>
                  <a 
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white text-slate-800 border border-border-strong hover:bg-slate-50 hover:border-slate-400 font-sans text-sm font-semibold transition-all shadow-xs" 
                    href="#pipeline"
                  >
                    <span className="material-symbols-outlined mr-2 text-[20px] text-primary">play_circle</span>
                    <span>See How It Works</span>
                  </a>
                </div>
                {/* Credible Technical Specs Badges */}
                <div className="w-full pt-6 border-t border-border-subtle grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 text-slate-700 font-mono text-xs">
                    <span className="material-symbols-outlined text-primary text-[18px]">memory</span>
                    <span>Hardware Edge Ingest</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-mono text-xs">
                    <span className="material-symbols-outlined text-primary text-[18px]">view_timeline</span>
                    <span>Multimodal Slide & OCR Alignment</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-mono text-xs">
                    <span className="material-symbols-outlined text-primary text-[18px]">cloud_done</span>
                    <span>Zero Teacher Overhead</span>
                  </div>
                </div>
              </div>

              {/* Hero Right Column (Image Showcase) */}
              <div className="lg:col-span-6 w-full relative">
                <div className="relative rounded-2xl bg-white p-2 sm:p-3 border border-border-strong/80 shadow-xl shadow-slate-200/50">
                  <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-[4/3] flex items-center justify-center">
                    <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfHeq_ntMwaSjrtTStjdk7s-SWUTtcq77V6XGGETyrDr7w4fi2w6sJKuW7n83WiXuqss1fXs5tnwTn4iUDUPerLdf3InwhLMhkSLpRQ1CdFXd6oZKJMFCIrk-t8QUyj3aGB4i9at315F09OlslqhXHQx_RxKEyueciW1uySjTvhwNLmdF-2VxH4hfCKoKSUbzqY8fIBuBImcUWBrI5prSLbZb88Bm2efHEQcIbKbUyoPxjsBrj3j4M6rapX-poJlBVFQ" 
                      alt="Autonomous Classroom Capture Hardware" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-700/80 shadow-lg text-white">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                        <span className="font-mono text-[10px] font-semibold tracking-wider text-slate-200 uppercase">
                          LIVE CAPTURE: AUDIO + VIDEO FEED
                        </span>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 pointer-events-none">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-700/80 shadow-lg text-white">
                        <span className="material-symbols-outlined text-cyan-400 text-[14px]">auto_graph</span>
                        <span className="font-mono text-[10px] font-semibold tracking-wider text-slate-200 uppercase">
                          LATEX OCR & TRANSCRIPT PIPELINE ACTIVE
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. PRODUCT STORY ("FROM CLASSROOM TO KNOWLEDGE" PIPELINE) */}
        <section className="w-full py-20 bg-white border-b border-border-subtle" id="pipeline">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-tint border border-border-strong text-slate-700 mb-3">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
                  Autonomous Ingestion
                </span>
              </div>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight uppercase mb-3">
                FROM CLASSROOM TO KNOWLEDGE
              </h2>
              <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed">
                How physical lecture acoustics and visual board work translate into revision-ready academic assets.
              </p>
            </div>
            {/* 5-Step Connected Flow Line */}
            <div className="relative">
              <div className="hidden lg:block absolute top-12 left-12 right-12 h-0.5 bg-gradient-to-r from-blue-200 via-slate-300 to-blue-200 z-0"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
                {/* Step 1 */}
                <div className="flex flex-col bg-surface-subtle border border-border-subtle hover:border-slate-300 rounded-xl p-6 transition-all shadow-xs group">
                  <div className="w-12 h-12 rounded-xl bg-white border border-border-strong flex items-center justify-center font-mono font-bold text-sm text-primary mb-4 shadow-2xs group-hover:scale-105 transition-transform">
                    01
                  </div>
                  <div className="flex items-center gap-1.5 mb-1 text-slate-900 font-bold text-sm uppercase tracking-wide">
                    <span>CAPTURE</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans mt-1">
                    Classroom audio + video captured continuously via podium-mounted low-profile edge sensor.
                  </p>
                </div>
                {/* Step 2 */}
                <div className="flex flex-col bg-surface-subtle border border-border-subtle hover:border-slate-300 rounded-xl p-6 transition-all shadow-xs group">
                  <div className="w-12 h-12 rounded-xl bg-white border border-border-strong flex items-center justify-center font-mono font-bold text-sm text-primary mb-4 shadow-2xs group-hover:scale-105 transition-transform">
                    02
                  </div>
                  <div className="flex items-center gap-1.5 mb-1 text-slate-900 font-bold text-sm uppercase tracking-wide">
                    <span>TRANSCRIBE</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans mt-1">
                    Lecture speech becomes searchable text with high-density STEM vocabulary recognition.
                  </p>
                </div>
                {/* Step 3 */}
                <div className="flex flex-col bg-surface-subtle border border-border-subtle hover:border-slate-300 rounded-xl p-6 transition-all shadow-xs group">
                  <div className="w-12 h-12 rounded-xl bg-white border border-border-strong flex items-center justify-center font-mono font-bold text-sm text-primary mb-4 shadow-2xs group-hover:scale-105 transition-transform">
                    03
                  </div>
                  <div className="flex items-center gap-1.5 mb-1 text-slate-900 font-bold text-sm uppercase tracking-wide">
                    <span>UNDERSTAND</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans mt-1">
                    AI identifies concepts, explanations, derivations, and visual whiteboard frames.
                  </p>
                </div>
                {/* Step 4 */}
                <div className="flex flex-col bg-surface-subtle border border-border-subtle hover:border-slate-300 rounded-xl p-6 transition-all shadow-xs group">
                  <div className="w-12 h-12 rounded-xl bg-white border border-border-strong flex items-center justify-center font-mono font-bold text-sm text-primary mb-4 shadow-2xs group-hover:scale-105 transition-transform">
                    04
                  </div>
                  <div className="flex items-center gap-1.5 mb-1 text-slate-900 font-bold text-sm uppercase tracking-wide">
                    <span>ORGANIZE</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans mt-1">
                    Knowledge becomes structured study material tagged to syllabus milestones and lecture blocks.
                  </p>
                </div>
                {/* Step 5 */}
                <div className="flex flex-col bg-surface-tint border border-blue-200 hover:border-blue-300 rounded-xl p-6 transition-all shadow-xs group">
                  <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-mono font-bold text-sm mb-4 shadow-sm group-hover:scale-105 transition-transform">
                    05
                  </div>
                  <div className="flex items-center gap-1.5 mb-1 text-slate-950 font-bold text-sm uppercase tracking-wide">
                    <span>STUDY</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans mt-1">
                    Summaries, formulas, quizzes, flashcards, and grounded AI Q&A ready in seconds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. WHY CLASSROOM CAPTURE IS BROKEN (THE PROBLEM) */}
        <section className="w-full py-20 bg-background border-b border-border-subtle" id="problem">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/80 text-slate-800 font-mono text-xs uppercase tracking-wider font-semibold mb-3">
                  Diagnostic Analysis
                </div>
                <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                  Why Classroom Capture Is Broken
                </h2>
              </div>
              <p className="font-sans text-sm sm:text-base text-slate-600 max-w-md">
                Traditional lecture capture fails either from unreliable human intervention or rigid enterprise overhead.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="p-8 rounded-2xl bg-white border border-border-subtle hover:border-border-strong shadow-xs transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-6 text-slate-800">
                    <span className="material-symbols-outlined text-[26px]">videocam_off</span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-slate-500 uppercase tracking-wider">Failure Mode 01</span>
                  <h3 className="font-sans text-xl font-bold text-slate-950 mt-1 mb-3">Manual Recording Fails</h3>
                  <p className="font-sans text-sm text-slate-600 leading-relaxed">
                    Students rely on phone recordings that run out of battery or sit blocked behind chairs. Instructors forget to tap "Record" on auditorium consoles, leading to zero continuity when exams approach.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between font-mono text-xs text-slate-500">
                  <span>Reliability Rate</span>
                  <span className="text-slate-800 font-semibold">Under 35%</span>
                </div>
              </div>
              {/* Card 2 */}
              <div className="p-8 rounded-2xl bg-white border border-border-subtle hover:border-border-strong shadow-xs transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-6 text-slate-800">
                    <span className="material-symbols-outlined text-[26px]">hourglass_empty</span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-slate-500 uppercase tracking-wider">Failure Mode 02</span>
                  <h3 className="font-sans text-xl font-bold text-slate-950 mt-1 mb-3">Raw Video Dumps Waste Hours</h3>
                  <p className="font-sans text-sm text-slate-600 leading-relaxed">
                    A 2-hour unindexed MP4 file provides no semantic search, no automated formula synchronization, and no timestamped concept indices. Students spend hours scrubbing through dead room silence.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between font-mono text-xs text-slate-500">
                  <span>Search Overhead</span>
                  <span className="text-slate-800 font-semibold">Unindexed Media</span>
                </div>
              </div>
              {/* Card 3 */}
              <div className="p-8 rounded-2xl bg-white border border-border-subtle hover:border-border-strong shadow-xs transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-6 text-slate-800">
                    <span className="material-symbols-outlined text-[26px]">settings_input_component</span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-slate-500 uppercase tracking-wider">Failure Mode 03</span>
                  <h3 className="font-sans text-xl font-bold text-slate-950 mt-1 mb-3">Traditional Systems are Inflexible</h3>
                  <p className="font-sans text-sm text-slate-600 leading-relaxed">
                    Legacy institutional setups require dedicated audio-visual technicians, specialized hardware racks, and complex manual post-processing workflows that cannot scale across every teaching room.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between font-mono text-xs text-slate-500">
                  <span>Operational Cost</span>
                  <span className="text-slate-800 font-semibold">High Crew Overhead</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. COMPREHENSIVE FEATURES (7 CARDS) */}
        <section className="w-full py-20 bg-white border-b border-border-subtle" id="features">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-tint border border-border-strong text-slate-700 font-mono text-xs uppercase tracking-wider font-semibold mb-3">
                System Modules
              </div>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-3">
                Engineered for Comprehensive Academic Review
              </h2>
              <p className="font-sans text-base text-slate-600">
                Seven tightly integrated capabilities converting live speech into permanent intellectual clarity.
              </p>
            </div>
            {/* 7 Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Card 1: Smart Summary */}
              <div className="p-6 rounded-2xl bg-surface-subtle border border-border-subtle hover:border-slate-300 hover:bg-white transition-all shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-white border border-border-strong text-primary flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[22px]">subject</span>
                  </div>
                  <h3 className="font-sans text-base font-bold text-slate-900 mb-2">1. Smart Summary</h3>
                  <p className="font-sans text-xs text-slate-600 leading-relaxed">
                    Get a concise, structured version of every lecture with hierarchical topics, timestamps, and core discussion takeaways.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-200/70 font-mono text-[11px] text-slate-500">
                  Module: Synthesis Core
                </div>
              </div>
              {/* Card 2: Key Concepts */}
              <div className="p-6 rounded-2xl bg-surface-subtle border border-border-subtle hover:border-slate-300 hover:bg-white transition-all shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-white border border-border-strong text-primary flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[22px]">label</span>
                  </div>
                  <h3 className="font-sans text-base font-bold text-slate-900 mb-2">2. Key Concepts</h3>
                  <p className="font-sans text-xs text-slate-600 leading-relaxed">
                    Extract definitions, explanations, and important ideas highlighted during spontaneous class discussions.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-200/70 font-mono text-[11px] text-slate-500">
                  Module: Semantic Extraction
                </div>
              </div>
              {/* Card 3: Formula / Key-Point Sheet */}
              <div className="p-6 rounded-2xl bg-surface-subtle border border-border-subtle hover:border-slate-300 hover:bg-white transition-all shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-white border border-border-strong text-primary flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[22px]">functions</span>
                  </div>
                  <h3 className="font-sans text-base font-bold text-slate-900 mb-2">3. Formula Sheet (LaTeX)</h3>
                  <p className="font-sans text-xs text-slate-600 leading-relaxed">
                    Keep important formulas and revision points in one place, converted directly into clean LaTeX expressions.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-200/70 font-mono text-[11px] text-slate-500">
                  Module: Visual OCR & TeX
                </div>
              </div>
              {/* Card 4: Lecture-Grounded AI Q&A */}
              <div className="p-6 rounded-2xl bg-surface-subtle border border-border-subtle hover:border-slate-300 hover:bg-white transition-all shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-white border border-border-strong text-primary flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[22px]">quick_reference</span>
                  </div>
                  <h3 className="font-sans text-base font-bold text-slate-900 mb-2">4. Lecture-Grounded AI Q&A</h3>
                  <p className="font-sans text-xs text-slate-600 leading-relaxed">
                    Ask questions and receive answers strictly grounded in captured lecture content with pinpoint timestamp citations.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-200/70 font-mono text-[11px] text-slate-500">
                  Module: Zero-Hallucination RAG
                </div>
              </div>
              {/* Card 5: Cross-Lecture Search */}
              <div className="p-6 rounded-2xl bg-surface-subtle border border-border-subtle hover:border-slate-300 hover:bg-white transition-all shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-white border border-border-strong text-primary flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[22px]">manage_search</span>
                  </div>
                  <h3 className="font-sans text-base font-bold text-slate-900 mb-2">5. Cross-Lecture Search</h3>
                  <p className="font-sans text-xs text-slate-600 leading-relaxed">
                    Find where a concept was explained across multiple lectures, terms, or parallel modules in seconds.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-200/70 font-mono text-[11px] text-slate-500">
                  Module: Vector Embedding Index
                </div>
              </div>
              {/* Card 6: Auto Quiz + Flashcards */}
              <div className="p-6 rounded-2xl bg-surface-subtle border border-border-subtle hover:border-slate-300 hover:bg-white transition-all shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-white border border-border-strong text-primary flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[22px]">style</span>
                  </div>
                  <h3 className="font-sans text-base font-bold text-slate-900 mb-2">6. Auto Quiz + Flashcards</h3>
                  <p className="font-sans text-xs text-slate-600 leading-relaxed">
                    Turn lecture content into active-recall study material with spaced repetition intervals exportable to standard platforms.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-200/70 font-mono text-[11px] text-slate-500">
                  Module: Cognitive Recall Engine
                </div>
              </div>
              {/* Card 7: Multilingual Support (Spans 2 on xl) */}
              <div className="p-6 rounded-2xl bg-surface-tint border border-blue-200 hover:border-blue-300 transition-all shadow-xs flex flex-col justify-between md:col-span-2 xl:col-span-2">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center mb-4 shadow-2xs">
                    <span className="material-symbols-outlined text-[22px]">translate</span>
                  </div>
                  <h3 className="font-sans text-base font-bold text-slate-900 mb-2">7. Multilingual Support & Code-Switching</h3>
                  <p className="font-sans text-xs text-slate-700 leading-relaxed mb-4">
                    Support multilingual classroom lecture processing and code-switching where technical vocabulary in English merges smoothly with regional explanatory dialects.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded bg-white border border-border-strong font-mono text-[10px] text-slate-700">English</span>
                    <span className="px-2.5 py-1 rounded bg-white border border-border-strong font-mono text-[10px] text-slate-700">Español</span>
                    <span className="px-2.5 py-1 rounded bg-white border border-border-strong font-mono text-[10px] text-slate-700">Hindi / Hinglish</span>
                    <span className="px-2.5 py-1 rounded bg-white border border-border-strong font-mono text-[10px] text-slate-700">Tamil</span>
                    <span className="px-2.5 py-1 rounded bg-white border border-border-strong font-mono text-[10px] text-slate-700">Mandarin</span>
                    <span className="px-2.5 py-1 rounded bg-white border border-border-strong font-mono text-[10px] text-slate-700">Deutsch</span>
                  </div>
                </div>
                <div className="mt-5 pt-3 border-t border-blue-200/80 font-mono text-[11px] text-primary font-medium">
                  Dialect-Adaptive Whisper Decoder
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. INTERACTIVE PRODUCT PREVIEW (STUDENT DASHBOARD MOCKUP) */}
        <section className="w-full py-20 bg-background border-b border-border-subtle" id="demo">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-tint border border-border-strong text-slate-700 mb-3">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">Live Experience Preview</span>
              </div>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-3">
                Interactive Student Dashboard
              </h2>
              <p className="font-sans text-base text-slate-600">
                Click through real synthesized artifacts generated immediately after lecture conclusion.
              </p>
            </div>
            {/* Dashboard Wrapper Container */}
            <div className="w-full rounded-2xl bg-white border border-border-strong shadow-xl overflow-hidden">
              {/* Top Window Bar */}
              <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                  <Link 
                    href="/dashboard"
                    className="ml-3 font-mono text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    BLACKBOX Academic Terminal — app.blackbox.internal (Click to Open)
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-[11px] font-mono text-cyan-300 border border-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                    Node Connected ({telemetry.nodeId || '04-B'})
                  </span>
                </div>
              </div>
              {/* Dashboard Body (Sidebar + Content) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
                {/* Left Sidebar */}
                <aside className="lg:col-span-3 bg-slate-50 border-r border-border-subtle p-5 flex flex-col justify-between">
                  <div className="space-y-6">
                    {/* Course Selector */}
                    <div>
                      <label className="block font-mono text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Active Course</label>
                      <div className="relative">
                        <select className="w-full pl-3 pr-8 py-2 rounded-lg bg-white border border-border-strong text-slate-900 font-sans text-xs font-semibold focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer">
                          <option>Digital Logic & Design (EE-201)</option>
                          <option>Engineering Physics (PHY-104)</option>
                          <option>Data Structures & Algorithms (CS-210)</option>
                          <option>Mathematics for Engineers (MATH-201)</option>
                        </select>
                      </div>
                    </div>
                    {/* Navigation List */}
                    <nav className="space-y-1">
                      <span className="block font-mono text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Workspace</span>
                      <Link 
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-primary text-white font-sans text-xs font-semibold shadow-xs" 
                        href="/dashboard"
                      >
                        <span className="material-symbols-outlined text-[18px]">dashboard</span>
                        <span>Full Workspace</span>
                      </Link>
                      <Link 
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-200/60 font-sans text-xs font-medium transition-colors" 
                        href="/dashboard"
                      >
                        <span className="material-symbols-outlined text-[18px] text-slate-500">video_library</span>
                        <span>Lectures (14)</span>
                      </Link>
                      <a 
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-200/60 font-sans text-xs font-medium transition-colors" 
                        href="#search-section"
                      >
                        <span className="material-symbols-outlined text-[18px] text-slate-500">search</span>
                        <span>Cross-Lecture Search</span>
                      </a>
                      <a 
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-200/60 font-sans text-xs font-medium transition-colors" 
                        href="#ai-qa"
                      >
                        <span className="material-symbols-outlined text-[18px] text-slate-500">forum</span>
                        <span>AI Q&A</span>
                      </a>
                      <button 
                        onClick={() => setActivePreviewTab('flashcards')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-200/60 font-sans text-xs font-medium transition-colors text-left"
                      >
                        <span className="material-symbols-outlined text-[18px] text-slate-500">quiz</span>
                        <span>Quizzes & Flashcards</span>
                      </button>
                    </nav>
                  </div>
                  {/* Spaced Repetition Mini Widget */}
                  <div className="mt-6 pt-4 border-t border-border-subtle bg-white p-3.5 rounded-xl border">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-sans text-xs font-bold text-slate-900">Active Recall</span>
                      <span className="font-mono text-[11px] text-primary font-semibold">87%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                      <div className="w-[87%] h-full bg-primary rounded-full"></div>
                    </div>
                    <p className="font-mono text-[11px] text-slate-600">7/8 flashcards mastered • Next review in 4h</p>
                  </div>
                </aside>

                {/* Main Content Area */}
                <main className="lg:col-span-9 p-6 lg:p-8 flex flex-col justify-between bg-white">
                  <div>
                    {/* Lecture Header */}
                    <div className="border-b border-border-subtle pb-5 mb-6">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded bg-surface-tint border border-border-strong font-mono text-[11px] font-semibold text-primary">LECTURE 04</span>
                          <span className="font-mono text-xs text-slate-500">54 Mins • Captured Today, 10:45 AM</span>
                        </div>
                        <Link 
                          href="/dashboard"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-primary text-slate-800 font-sans text-xs font-semibold transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                          <span>Open Full Workspace</span>
                        </Link>
                      </div>
                      <h3 className="font-sans text-2xl font-extrabold text-slate-950 tracking-tight">
                        Digital Logic & Design — Lecture 04: Finite State Machines & Synchronous Counters
                      </h3>
                    </div>

                    {/* Interactive Tabs Bar */}
                    <div className="flex items-center gap-2 border-b border-border-subtle mb-6 overflow-x-auto pb-1 text-xs">
                      <button 
                        onClick={() => setActivePreviewTab('summary')}
                        className={`px-4 py-2 rounded-t-lg font-bold flex items-center gap-2 shrink-0 transition-colors ${
                          activePreviewTab === 'summary' 
                            ? 'bg-surface-subtle border-b-2 border-primary text-primary' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">subject</span>
                        <span>Smart Summary</span>
                      </button>
                      <button 
                        onClick={() => setActivePreviewTab('formulas')}
                        className={`px-4 py-2 rounded-t-lg font-bold flex items-center gap-2 shrink-0 transition-colors ${
                          activePreviewTab === 'formulas' 
                            ? 'bg-surface-subtle border-b-2 border-primary text-primary' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">functions</span>
                        <span>Formula Sheet (LaTeX)</span>
                      </button>
                      <button 
                        onClick={() => setActivePreviewTab('concepts')}
                        className={`px-4 py-2 rounded-t-lg font-bold flex items-center gap-2 shrink-0 transition-colors ${
                          activePreviewTab === 'concepts' 
                            ? 'bg-surface-subtle border-b-2 border-primary text-primary' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">label</span>
                        <span>Key Concepts ({concepts.length})</span>
                      </button>
                      <button 
                        onClick={() => setActivePreviewTab('flashcards')}
                        className={`px-4 py-2 rounded-t-lg font-bold flex items-center gap-2 shrink-0 transition-colors ${
                          activePreviewTab === 'flashcards' 
                            ? 'bg-surface-subtle border-b-2 border-primary text-primary' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">style</span>
                        <span>Flashcards ({flashcards.length})</span>
                      </button>
                    </div>

                    {/* Content Views */}
                    {activePreviewTab === 'summary' && (
                      <div className="space-y-5">
                        {/* Smart Summary Card */}
                        <div className="p-5 rounded-xl bg-surface-subtle border border-border-subtle">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-sans text-sm font-bold text-slate-950 flex items-center gap-2">
                              <span className="material-symbols-outlined text-primary text-[18px]">menu_book</span>
                              <span>Executive Lecture Synthesis</span>
                            </h4>
                            <span className="font-mono text-[11px] text-slate-500">Autonomous Extraction SLA: 45s</span>
                          </div>
                          <ul className="space-y-2.5 text-xs font-sans text-slate-700 leading-relaxed">
                            <li className="flex items-start gap-2">
                              <button 
                                onClick={() => {
                                  setQaInput("What is the distinction between Mealy and Moore FSMs at 04:12?");
                                  handleAskTutor("What is the distinction between Mealy and Moore FSMs at 04:12?");
                                  document.getElementById('ai-qa')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="font-mono text-[11px] font-semibold text-primary bg-white px-1.5 py-0.5 rounded border border-border-strong hover:bg-blue-50 transition shrink-0"
                              >
                                [04:12]
                              </button>
                              <span>Distinction between <strong>Mealy and Moore FSMs</strong>: Mealy outputs depend on current state + present inputs; Moore outputs depend strictly on state register contents.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <button 
                                onClick={() => {
                                  setQaInput("Explain the state minimization algorithm using partition refinement theorem at 18:40.");
                                  handleAskTutor("Explain the state minimization theorem and when we can merge states.");
                                  document.getElementById('ai-qa')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="font-mono text-[11px] font-semibold text-primary bg-white px-1.5 py-0.5 rounded border border-border-strong hover:bg-blue-50 transition shrink-0"
                              >
                                [18:40]
                              </button>
                              <span>State minimization algorithm using <strong>partition refinement theorem</strong> to merge redundant flip-flop configurations.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <button 
                                onClick={() => {
                                  setQaInput("Explain synchronous counter design using JK flip-flops at 38:05.");
                                  handleAskTutor("Explain synchronous counter design using JK flip-flops at 38:05.");
                                  document.getElementById('ai-qa')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="font-mono text-[11px] font-semibold text-primary bg-white px-1.5 py-0.5 rounded border border-border-strong hover:bg-blue-50 transition shrink-0"
                              >
                                [38:05]
                              </button>
                              <span>Synchronous counter design using JK flip-flops: derivation of state transition excitation equations avoiding race conditions and setup-time violations.</span>
                            </li>
                          </ul>
                        </div>

                        {/* Two-Column Block: Key Concepts + Formula Card */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Key Concepts Chips */}
                          <div className="p-4 rounded-xl bg-white border border-border-strong flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-2.5">
                                <span className="font-mono text-xs font-bold text-slate-800 uppercase">Key Concepts</span>
                                <span className="text-[11px] font-mono text-slate-500">Indexed from Board</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5 mb-2">
                                {concepts.slice(0, 4).map((c, i) => (
                                  <button
                                    key={i}
                                    onClick={() => setActiveConceptIdx(i)}
                                    className="px-2.5 py-1 rounded bg-slate-100 hover:bg-indigo-50 border border-slate-200 text-slate-800 font-sans text-xs font-medium text-left transition"
                                  >
                                    {c.title}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <p className="font-mono text-[11px] text-slate-500 mt-2">All concepts cross-referenced with syllabus and textbook Chapter 7.</p>
                          </div>

                          {/* Formula Sheet Card with clean LaTeX */}
                          <div className="p-4 rounded-xl bg-surface-tint border border-blue-200 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-mono text-xs font-bold text-slate-900 uppercase">Formula Sheet • LaTeX OCR</span>
                                <button
                                  onClick={() => handleCopyFormula('Q_{next} = J \\cdot \\overline{Q} + \\overline{K} \\cdot Q')}
                                  className="text-primary hover:text-primary-hover p-1 rounded transition"
                                  title="Copy LaTeX"
                                >
                                  <span className="material-symbols-outlined text-[16px]">
                                    {copiedFormula ? 'check' : 'content_copy'}
                                  </span>
                                </button>
                              </div>
                              <div className="p-2.5 rounded bg-white border border-blue-100 font-mono text-xs text-slate-900 space-y-1">
                                <div>Q_{'{next}'} = J \cdot \overline{'{Q}'} + \overline{'{K}'} \cdot Q</div>
                                <div className="text-slate-500 text-[11px]">T_{'{clk}'} \ge T_{'{prop}'} + T_{'{setup}'} + T_{'{skew}'}</div>
                              </div>
                            </div>
                            <span className="text-[11px] font-mono text-primary font-medium mt-2">Derived directly from Prof's center board notes</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activePreviewTab === 'formulas' && (
                      <div className="space-y-4">
                        <div className="p-5 rounded-xl bg-surface-tint border border-blue-200">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-sans text-sm font-bold text-slate-900 flex items-center gap-2">
                              <span className="material-symbols-outlined text-primary text-[18px]">functions</span>
                              <span>Extracted Formulas & Math Blocks</span>
                            </h4>
                            <span className="font-mono text-xs text-primary font-semibold">OCR Confidence: 99.4%</span>
                          </div>
                          <div className="space-y-3">
                            <div className="p-3.5 rounded-lg bg-white border border-blue-100 font-mono text-xs text-slate-900 flex items-center justify-between">
                              <div>
                                <div className="font-bold text-slate-800 mb-1">JK Flip-Flop Characteristic:</div>
                                <div className="text-primary">Q_{'{next}'} = J \cdot \overline{'{Q}'} + \overline{'{K}'} \cdot Q</div>
                              </div>
                              <button 
                                onClick={() => handleCopyFormula('Q_{next} = J \\cdot \\overline{Q} + \\overline{K} \\cdot Q')}
                                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 font-sans text-xs font-semibold text-slate-700"
                              >
                                {copiedFormula ? 'Copied!' : 'Copy'}
                              </button>
                            </div>
                            <div className="p-3.5 rounded-lg bg-white border border-blue-100 font-mono text-xs text-slate-900 flex items-center justify-between">
                              <div>
                                <div className="font-bold text-slate-800 mb-1">Maximum Clock Operating Frequency:</div>
                                <div className="text-primary">f_{'{max}'} \le \frac{'{1}'}{'{t_{cq} + t_{comb} + t_{setup}}'}</div>
                              </div>
                              <button 
                                onClick={() => handleCopyFormula('f_{max} \\le \\frac{1}{t_{cq} + t_{comb} + t_{setup}}')}
                                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 font-sans text-xs font-semibold text-slate-700"
                              >
                                Copy
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activePreviewTab === 'concepts' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {concepts.map((concept, idx) => (
                            <div 
                              key={idx}
                              onClick={() => setActiveConceptIdx(idx)}
                              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                                activeConceptIdx === idx 
                                  ? 'bg-blue-50/70 border-primary ring-1 ring-primary/20' 
                                  : 'bg-white border-border-strong hover:border-slate-400'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="font-sans text-sm font-bold text-slate-900">{concept.title}</span>
                                <span className="font-mono text-[10px] text-primary">Concept 0{idx + 1}</span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed font-sans">{concept.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activePreviewTab === 'flashcards' && (
                      <div className="space-y-4">
                        <div className="p-6 rounded-xl bg-surface-subtle border border-border-strong text-center flex flex-col items-center justify-center min-h-[220px]">
                          <div className="font-mono text-[11px] text-slate-500 mb-2 uppercase tracking-wider">
                            Card {currentCardIdx + 1} of {flashcards.length} • Active Recall Mode
                          </div>
                          <div className="max-w-md w-full p-5 rounded-xl bg-white border border-slate-200 shadow-sm cursor-pointer transition-all hover:shadow-md" onClick={() => setIsCardFlipped(!isCardFlipped)}>
                            <p className="font-sans text-sm font-bold text-slate-900 mb-2">
                              {isCardFlipped ? 'Answer:' : 'Question:'}
                            </p>
                            <p className="font-sans text-xs text-slate-700 leading-relaxed">
                              {isCardFlipped ? flashcards[currentCardIdx].a : flashcards[currentCardIdx].q}
                            </p>
                            <span className="inline-block mt-4 text-[11px] text-primary font-mono font-medium">
                              (Click card to {isCardFlipped ? 'show question' : 'reveal answer'})
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-4">
                            <button
                              disabled={currentCardIdx === 0}
                              onClick={() => { setCurrentCardIdx(prev => prev - 1); setIsCardFlipped(false); }}
                              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                            >
                              Previous
                            </button>
                            <button
                              onClick={() => setIsCardFlipped(!isCardFlipped)}
                              className="px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover"
                            >
                              Flip Card
                            </button>
                            <button
                              disabled={currentCardIdx === flashcards.length - 1}
                              onClick={() => { setCurrentCardIdx(prev => prev + 1); setIsCardFlipped(false); }}
                              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Ask BLACKBOX Quick Bar */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-border-strong flex items-center gap-3 mt-6">
                    <span className="material-symbols-outlined text-primary text-[20px]">smart_toy</span>
                    <input 
                      className="flex-1 bg-transparent border-0 font-sans text-xs text-slate-800 placeholder:text-slate-400 focus:ring-0 focus:outline-none" 
                      placeholder="Ask BLACKBOX AI anything about Lecture 04..." 
                      type="text" 
                      value={qaInput}
                      onChange={(e) => setQaInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAskTutor();
                          document.getElementById('ai-qa')?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    />
                    <button 
                      onClick={() => {
                        handleAskTutor();
                        document.getElementById('ai-qa')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-primary text-white font-sans text-xs font-semibold hover:bg-primary-hover transition-colors shadow-2xs shrink-0"
                    >
                      Query Tutor
                    </button>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </section>

        {/* 8. LECTURE-GROUNDED AI Q&A DEMO */}
        <section className="w-full py-20 bg-white border-b border-border-subtle" id="ai-qa">
          <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-tint border border-border-strong text-slate-700 mb-3">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">Deterministic Grounding</span>
              </div>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-3">
                Lecture-Grounded AI Q&A
              </h2>
              <p className="font-sans text-base text-slate-600">
                Answers cite precise classroom speech and visual whiteboard timestamps to eliminate hallucination.
              </p>
            </div>

            {/* Quick Prompt Pill Selectors */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              <span className="text-xs font-mono text-slate-500 mr-1">Suggested Inquiries:</span>
              <button
                onClick={() => {
                  const q = "Explain the state minimization theorem and when we can merge states.";
                  setQaInput(q);
                  handleAskTutor(q);
                }}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 border border-slate-200 text-xs font-medium text-slate-700 transition"
              >
                State Minimization Theorem
              </button>
              <button
                onClick={() => {
                  const q = "What is the difference between Mealy and Moore machines?";
                  setQaInput(q);
                  handleAskTutor(q);
                }}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 border border-slate-200 text-xs font-medium text-slate-700 transition"
              >
                Mealy vs Moore
              </button>
              <button
                onClick={() => {
                  const q = "What limits the maximum clock frequency f_max?";
                  setQaInput(q);
                  handleAskTutor(q);
                }}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 border border-slate-200 text-xs font-medium text-slate-700 transition"
              >
                Clock Skew & f_max
              </button>
            </div>

            {/* Conversational Container */}
            <div className="rounded-2xl bg-surface-subtle border border-border-strong shadow-lg p-6 sm:p-8 space-y-6">
              {/* User Query Bubble */}
              <div className="flex items-start justify-end gap-3.5">
                <div className="max-w-2xl bg-slate-900 text-white rounded-2xl rounded-tr-sm p-4 text-xs sm:text-sm font-sans shadow-xs">
                  <div className="font-mono text-[11px] text-slate-400 mb-1 font-semibold">You (Student)</div>
                  {qaInput || "Explain the state minimization theorem discussed in today's lecture and when we can merge states."}
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  ST
                </div>
              </div>

              {/* BLACKBOX Tutor Answer */}
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs">
                  BB
                </div>
                <div className="max-w-3xl bg-white border border-border-strong rounded-2xl rounded-tl-sm p-5 sm:p-6 text-slate-900 space-y-4 shadow-sm w-full">
                  <div className="flex items-center justify-between font-mono text-xs text-slate-500 border-b border-slate-100 pb-2.5">
                    <span className="font-semibold text-primary flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      BLACKBOX Grounded Engine
                    </span>
                    <span>Latency: {qaResponse.latency} • Zero Guessing</span>
                  </div>

                  {qaLoading ? (
                    <div className="flex items-center gap-3 py-6 text-slate-500 font-mono text-xs">
                      <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                      <span>Synthesizing acoustic transcript & LaTeX board OCR from Node 04...</span>
                    </div>
                  ) : (
                    <>
                      <div className="font-sans text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                        {qaResponse.answer}
                      </div>

                      {/* Rendered Formula Box */}
                      <div className="p-3 rounded-lg bg-surface-tint border border-blue-200 font-mono text-xs text-slate-900">
                        \lambda(S_1, x) = \lambda(S_2, x) \quad \text{'{and}'} \quad \delta(S_1, x) \equiv \delta(S_2, x) \quad \forall x \in \Sigma
                      </div>

                      {/* Source Attribution Card Proving Physical Classroom Capture */}
                      <div className="pt-3 border-t border-slate-100">
                        <div className="font-mono text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Verified Classroom Sources:</div>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 font-mono text-xs">
                            <span className="material-symbols-outlined text-primary text-[16px]">school</span>
                            <span>Digital Logic & Design // Lecture 04</span>
                          </div>
                          {qaResponse.citations.map((c, i) => (
                            <Link 
                              key={i}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-primary font-mono text-xs font-semibold transition-colors" 
                              href="/dashboard"
                            >
                              <span className="material-symbols-outlined text-[16px]">play_circle</span>
                              <span>{c.label} ({c.source})</span>
                            </Link>
                          ))}
                          <Link 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-mono text-xs transition-colors" 
                            href="/dashboard"
                          >
                            <span className="material-symbols-outlined text-[16px]">image</span>
                            <span>Jump to Whiteboard Capture</span>
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Interactive Q&A Form Field */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={qaInput}
                  onChange={(e) => setQaInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAskTutor();
                  }}
                  placeholder="Ask any question grounded in the semester syllabus..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white border border-border-strong text-slate-900 font-sans text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <button
                  onClick={() => handleAskTutor()}
                  disabled={qaLoading}
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-sans text-xs sm:text-sm font-semibold transition shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>Ask AI Tutor</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 9. CROSS-LECTURE SEARCH EXPERIENCE */}
        <section className="w-full py-20 bg-background border-b border-border-subtle" id="search-section">
          <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-tint border border-border-strong text-slate-700 mb-3">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">Cross-Lecture Index</span>
              </div>
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-3">
                Search Across Every Lecture in the Semester
              </h2>
              <p className="font-sans text-base text-slate-600">
                Locate specific derivations, analogies, and professor remarks instantly across whole academic years.
              </p>
            </div>
            {/* Search Bar Input */}
            <div className="w-full mb-8">
              <div className="relative flex items-center bg-white rounded-2xl border border-border-strong shadow-md p-2">
                <span className="material-symbols-outlined text-primary ml-3 text-[24px]">search</span>
                <input 
                  className="w-full px-3 py-2 bg-transparent text-slate-900 font-sans text-sm sm:text-base font-semibold focus:outline-none" 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => {
                    const q = e.target.value;
                    setSearchQuery(q);
                    executeSearch(q);
                  }}
                  placeholder="Type any topic, equation, or keyword (e.g. Newton, Mealy, ODE, Flip-Flop)..."
                />
                <span className="hidden sm:inline-flex px-3 py-1 rounded bg-slate-100 border border-slate-200 font-mono text-xs text-slate-600 mr-2 shrink-0">
                  {isSearching ? 'Searching...' : `${searchResults.length} occurrences found`}
                </span>
              </div>
            </div>
            {/* Search Results List */}
            <div className="space-y-4">
              {searchResults.map((res, i) => (
                <div 
                  key={res.id || i}
                  className="p-5 rounded-xl bg-white border border-border-subtle hover:border-slate-300 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-primary text-white font-mono text-[10px] font-bold">
                        {res.relevance || '95% RELEVANCE'}
                      </span>
                      <span className="font-sans text-sm font-bold text-slate-900">
                        {res.lectureTitle}
                      </span>
                      <span className="font-mono text-xs text-primary font-semibold">
                        {res.timestamp}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-slate-600 leading-relaxed bg-slate-50 p-2 rounded border border-slate-100">
                      {res.snippet}
                    </p>
                  </div>
                  <Link 
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-surface-tint border border-border-strong hover:bg-slate-200 text-slate-800 font-sans text-xs font-semibold shrink-0 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                    <span>Open Lecture</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. FINAL CTA SECTION (WAITLIST) */}
        <section className="w-full py-20 lg:py-28 bg-gradient-to-b from-white to-surface-tint/60" id="waitlist-section">
          <div className="max-w-[840px] mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-border-strong text-slate-800 mb-6 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="font-mono text-xs font-semibold uppercase tracking-wider">Prototype Pilot Deployment</span>
            </div>
            <h2 className="font-sans text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight mb-4">
              From Classroom Lectures to Ready-to-Study Knowledge.
            </h2>
            <p className="font-sans text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              BLACKBOX transforms captured classroom content into a structured study layer students can search, understand and revise.
            </p>
            {/* Waitlist Input Pill */}
            <div className="max-w-xl mx-auto bg-white p-2 rounded-2xl border border-border-strong shadow-lg mb-4">
              {!waitlistSubmitted ? (
                <form 
                  className="flex flex-col sm:flex-row items-center gap-2" 
                  onSubmit={handleWaitlistSubmit}
                >
                  <div className="flex-1 w-full pl-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 text-[20px]">mail</span>
                    <input 
                      className="w-full py-2 bg-transparent text-slate-900 font-sans text-sm focus:outline-none placeholder:text-slate-400 border-0 focus:ring-0" 
                      placeholder="Enter institutional or student email" 
                      required 
                      type="email"
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                    />
                  </div>
                  <button 
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-sans text-sm font-semibold transition-all shadow-xs shrink-0 disabled:opacity-50" 
                    type="submit"
                    disabled={waitlistLoading}
                  >
                    {waitlistLoading ? 'Submitting...' : 'Join Prototype Pilot'}
                  </button>
                </form>
              ) : (
                <div className="py-4 text-center text-slate-900">
                  <span className="material-symbols-outlined text-primary text-[28px]">task_alt</span>
                  <p className="font-sans text-sm font-bold mt-1">{waitlistMsg}</p>
                  <p className="font-sans text-xs text-slate-500 mt-0.5">We will verify your academic domain and follow up directly.</p>
                </div>
              )}
            </div>
            <div className="flex justify-center mb-10">
              <Link className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-primary transition-colors" href="/dashboard">
                <span>Or explore interactive student workspace</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
            {/* Technical Telemetry Note */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500 font-mono text-xs">
              <span>End-to-End Encrypted</span>
              <span>•</span>
              <span>FERPA & GDPR Compliant</span>
              <span>•</span>
              <span>Podium Edge Architecture</span>
            </div>
          </div>
        </section>
      </main>

      {/* 11. FOOTER */}
      <footer className="w-full bg-white border-t border-border-subtle py-14">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            {/* Col 1: Brand */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <Link className="inline-block" href="/">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#0b1c30] flex items-center justify-center text-white shadow-sm ring-1 ring-black/5">
                    <div className="flex items-center gap-0.5">
                      <span className="w-1 h-2.5 bg-indigo-400 rounded-full animate-pulse"></span>
                      <span className="w-1 h-3.5 bg-white rounded-full"></span>
                      <span className="w-1 h-1.5 bg-indigo-300 rounded-full"></span>
                    </div>
                  </div>
                  <span className="font-bold text-lg tracking-tight text-slate-950 font-mono">
                    BLACKBOX
                  </span>
                </div>
              </Link>
              <p className="font-sans text-xs text-slate-600 max-w-sm leading-relaxed">
                Autonomous lecture capture and intelligent academic synthesis runtime. Turning physical teaching acoustics into structured study assets.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-surface-subtle border border-border-subtle max-w-fit">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="font-mono text-[11px] text-slate-700 font-medium">Node Telemetry: Operational ({telemetry.nodeId || '04-B'})</span>
              </div>
            </div>
            {/* Col 2: Architecture */}
            <div className="flex flex-col gap-2.5">
              <span className="font-mono text-xs uppercase text-slate-900 font-bold tracking-wider mb-1">Architecture</span>
              <a className="font-sans text-xs text-slate-600 hover:text-slate-950 transition-colors" href="#pipeline">Audio Ingestion</a>
              <a className="font-sans text-xs text-slate-600 hover:text-slate-950 transition-colors" href="#pipeline">Whisper Alignment</a>
              <a className="font-sans text-xs text-slate-600 hover:text-slate-950 transition-colors" href="#features">LaTeX OCR</a>
              <Link className="font-sans text-xs text-slate-600 hover:text-slate-950 transition-colors" href="/dashboard">Security & Privacy</Link>
            </div>
            {/* Col 3: Modules */}
            <div className="flex flex-col gap-2.5">
              <span className="font-mono text-xs uppercase text-slate-900 font-bold tracking-wider mb-1">Modules</span>
              <button onClick={() => { setActivePreviewTab('summary'); document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' }); }} className="font-sans text-xs text-slate-600 hover:text-slate-950 text-left transition-colors">Smart Summary</button>
              <button onClick={() => { setActivePreviewTab('concepts'); document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' }); }} className="font-sans text-xs text-slate-600 hover:text-slate-950 text-left transition-colors">Key Concepts</button>
              <button onClick={() => { setActivePreviewTab('formulas'); document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' }); }} className="font-sans text-xs text-slate-600 hover:text-slate-950 text-left transition-colors">Formula Sheet</button>
              <a className="font-sans text-xs text-slate-600 hover:text-slate-950 transition-colors" href="#ai-qa">Lecture AI Q&A</a>
            </div>
            {/* Col 4: Telemetry */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs uppercase text-slate-900 font-bold tracking-wider mb-1">Telemetry Status</span>
              <div className="p-3 rounded-lg bg-surface-subtle border border-border-subtle font-mono text-[11px] text-slate-600 space-y-1">
                <div>PIPELINE: v2.4-edge</div>
                <div>WER STEM: 1.2%</div>
                <div>SLA: &lt; 60s ingest</div>
              </div>
            </div>
          </div>
          {/* Bottom Bar */}
          <div className="pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-500">
            <div>© 2026 BLACKBOX Intelligence. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <Link className="hover:text-slate-900 transition-colors" href="/dashboard">Student Workspace</Link>
              <span>•</span>
              <a className="hover:text-slate-900 transition-colors" href="#demo">Preview</a>
              <span>•</span>
              <a className="hover:text-slate-900 transition-colors" href="#waitlist-section">Pilot Access</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
