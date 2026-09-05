'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  Clock, 
  Play, 
  Pause, 
  Volume2, 
  ChevronRight, 
  FileText, 
  CheckCircle2, 
  RotateCcw, 
  FastForward, 
  Share2, 
  Bookmark, 
  Tag, 
  Layers, 
  Sliders
} from 'lucide-react';
import { 
  LECTURE_METADATA, 
  TOPICS, 
  KEY_CONCEPTS, 
  TRANSCRIPTS, 
  LectureTopic 
} from '@/data/lectureData';

export const NotesView: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string>('t2');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const togglePlayAudio = (id: string) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12 animate-fadeIn">
      {/* 1. SMART SUMMARY / EXECUTIVE SYNTHESIS */}
      <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold block">
                Executive Synthesis
              </span>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Smart Summary & Categorized Takeaways
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Synthesized in 1.4s • Sarvam AI</span>
          </div>
        </div>

        <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
          This lecture formalizes <strong className="font-semibold text-indigo-700">synchronous finite state machine (FSM)</strong> architectures, contrasting Mealy and Moore machine outputs, and formalizes state minimization using partition refinement algorithms. Synchronous 3-bit up/down counter design is derived with JK flip-flops to completely eliminate the cumulative propagation delays inherent in asynchronous ripple counters.
        </p>

        {/* Synthesis Key Takeaways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          <div className="bg-slate-50/90 border border-slate-200/70 p-4 rounded-xl flex flex-col gap-1.5 hover:border-indigo-200 transition">
            <div className="flex items-center gap-2 text-indigo-700 font-mono text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
              <span>Mealy vs Moore Outputs</span>
            </div>
            <p className="text-xs text-slate-600 leading-normal">
              Mealy outputs depend on current state &amp; immediate inputs (asynchronous glitches possible); Moore outputs depend strictly on the present state registers.
            </p>
          </div>

          <div className="bg-slate-50/90 border border-slate-200/70 p-4 rounded-xl flex flex-col gap-1.5 hover:border-indigo-200 transition">
            <div className="flex items-center gap-2 text-indigo-700 font-mono text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
              <span>JK Inversion Synthesis</span>
            </div>
            <p className="text-xs text-slate-600 leading-normal">
              Excitation mapping yields J=1, K=1 for toggle transitions, directly resolving next-state count logic without race hazards.
            </p>
          </div>

          <div className="bg-slate-50/90 border border-slate-200/70 p-4 rounded-xl flex flex-col gap-1.5 hover:border-indigo-200 transition">
            <div className="flex items-center gap-2 text-indigo-700 font-mono text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
              <span>Clock Skew Timing Hazard</span>
            </div>
            <p className="text-xs text-slate-600 leading-normal">
              Maximum clock frequency is strictly constrained by setup delay <span className="font-mono text-indigo-600 font-medium">t_setup</span> and combinational propagation <span className="font-mono text-indigo-600 font-medium">t_comb</span>.
            </p>
          </div>
        </div>
      </section>

      {/* 2. ACOUSTIC & BLACKBOARD TIMELINE SCRUB */}
      <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold block">
                Acoustic &amp; Blackboard Timeline
              </span>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Topic Clusters &amp; Lecture Scrub
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-500">
            <span className="text-slate-800 font-bold">08:32</span>
            <span>/</span>
            <span>48:00</span>
          </div>
        </div>

        {/* Interactive Audio Scrub Graphic Visualization */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col gap-3">
          <div className="relative w-full h-14 bg-slate-100 rounded-lg flex items-center px-3 overflow-hidden cursor-pointer group">
            {/* Simulated Waveform Audio Track */}
            <svg className="w-full h-10 text-slate-300 group-hover:text-indigo-200 transition" preserveAspectRatio="none" viewBox="0 0 800 60">
              <path d="M0,30 Q20,5 40,30 T80,30 T120,8 T160,30 T200,45 T240,30 T280,10 T320,30 T360,52 T400,30 T440,2 T480,30 T520,40 T560,30 T600,12 T640,30 T680,48 T720,30 T760,18 T800,30" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5"></path>
              <path d="M0,30 Q15,18 30,30 T60,30 T90,14 T120,30 T150,38 T180,30 T210,16 T240,30 T270,44 T300,30 T330,8 T360,30 T390,36 T420,30 T450,20 T480,30 T510,42 T540,30 T570,22 T600,30 T630,38 T660,30 T690,14 T720,30 T750,26 T780,30 T800,30" fill="none" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.5"></path>
            </svg>
            
            {/* Active progress filled slice */}
            <div className="absolute left-0 top-0 bottom-0 w-[24%] bg-indigo-500/15 pointer-events-none"></div>
            
            {/* Scrub Head Bar */}
            <div className="absolute left-[24%] top-0 bottom-0 w-0.5 bg-indigo-600 pointer-events-none shadow-md flex items-center justify-center">
              <div className="w-3.5 h-3.5 bg-indigo-600 rounded-full absolute shadow-sm ring-2 ring-white"></div>
            </div>

            {/* Topic marker flags */}
            <div className="absolute left-[1%] bottom-1 font-mono text-[10px] text-slate-400">00:04</div>
            <div className="absolute left-[24%] bottom-1 font-mono text-[10px] text-indigo-700 font-bold">08:32</div>
            <div className="absolute left-[40%] bottom-1 font-mono text-[10px] text-slate-400">19:14</div>
            <div className="absolute left-[66%] bottom-1 font-mono text-[10px] text-slate-400">31:40</div>
            <div className="absolute left-[88%] bottom-1 font-mono text-[10px] text-slate-400">42:15</div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition shadow-sm"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 transition">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 transition">
                <FastForward className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-mono text-slate-700 font-medium pl-2">
                1.25x Speed • Stereo Node 04
              </span>
            </div>
            <div className="text-xs font-mono text-slate-500">
              Active Topic: <strong className="text-indigo-600 font-semibold">FSM Mealy vs Moore</strong>
            </div>
          </div>
        </div>

        {/* Topic Clusters List */}
        <div className="flex flex-col gap-2">
          {TOPICS.map((topic) => {
            const isSelected = activeTopic === topic.id;
            return (
              <div
                key={topic.id}
                onClick={() => setActiveTopic(topic.id)}
                className={`
                  flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer
                  ${isSelected 
                    ? 'bg-indigo-50/70 border-indigo-200 text-slate-900 shadow-xs' 
                    : 'bg-slate-50/60 border-slate-200/60 text-slate-700 hover:bg-slate-100/70'}
                `}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`font-mono text-xs font-semibold w-12 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {topic.time}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs sm:text-sm font-semibold truncate ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                        {topic.title}
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0"></span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 truncate">
                      {topic.subtitle}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 pl-2">
                  {isSelected ? (
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-full">
                      Now Scrubbed
                    </span>
                  ) : (
                    <Play className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. CATEGORIZED KEY TERMS & TAXONOMY CONTAINER */}
      <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold block">
                Taxonomy &amp; Ontology
              </span>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Bulleted Key Concepts &amp; Definitions
              </h2>
            </div>
          </div>
          <span className="text-xs font-mono bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-600">
            {KEY_CONCEPTS.length} Extracted Terms
          </span>
        </div>

        {/* Key Terms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {KEY_CONCEPTS.map((concept) => (
            <div 
              key={concept.id}
              className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 flex flex-col gap-2 hover:border-slate-300 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                  {concept.title}
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100/80">
                  {concept.tag}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-3.5 border-l border-slate-200">
                {concept.definition}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DUAL-SPEAKER DIARIZED TRANSCRIPT */}
      <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center shadow-xs">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold block">
                Acoustic Diarization Stream
              </span>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Dual-Speaker Classroom Transcript
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Sarvam ASR Confidence: 99.1% High</span>
          </div>
        </div>

        <div className="flex flex-col gap-3.5">
          {TRANSCRIPTS.map((tr) => {
            const isPlayingThis = playingAudioId === tr.id;
            return (
              <div 
                key={tr.id}
                className={`
                  p-4 rounded-xl border flex flex-col gap-2 transition
                  ${tr.role === 'professor' 
                    ? 'bg-slate-50/80 border-slate-200/80' 
                    : 'bg-indigo-50/50 border-indigo-100 ml-4 sm:ml-8'}
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-white border border-slate-200 px-1.5 py-0.5 rounded text-indigo-700">
                      {tr.time}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {tr.speaker}
                    </span>
                  </div>
                  <button 
                    onClick={() => togglePlayAudio(tr.id)}
                    className="text-slate-400 hover:text-indigo-600 transition flex items-center gap-1 text-xs font-mono"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isPlayingThis ? 'Playing snippet...' : 'Play Audio'}</span>
                  </button>
                </div>
                <p className={`text-xs sm:text-sm text-slate-700 leading-relaxed pl-2 ${tr.isQuestion ? 'italic font-medium text-indigo-950' : ''}`}>
                  "{tr.text}"
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
