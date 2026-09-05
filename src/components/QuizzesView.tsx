'use client';

import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  RotateCw, 
  Layers, 
  Award, 
  ArrowRight, 
  ArrowLeft, 
  Bookmark, 
  Video, 
  Check
} from 'lucide-react';
import { QUIZ_QUESTIONS, FLASHCARDS, QuizQuestion, Flashcard } from '@/data/lectureData';

export const QuizzesView: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>('B');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const question = QUIZ_QUESTIONS[currentQuestionIndex];
  const card = FLASHCARDS[currentCardIndex];

  return (
    <div className="flex flex-col gap-6 pb-12 animate-fadeIn">
      {/* Quiz & Flashcards Top Header */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center shadow-xs">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold block">
                Active Recall & Spaced Repetition
              </span>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Auto-Generated Lecture Quiz & Flashcards
              </h2>
            </div>
          </div>
          <span className="text-xs font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-lg font-semibold">
            100% Professor Grounded
          </span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          Questions and flashcard decks generated directly from the transcribed lecture audio and blackboard diagram states. Practice active recall with immediate source grounding verification.
        </p>
      </section>

      {/* Main Grid: Quiz Module & Flashcards Module */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Interactive Practice Quiz (7 Cols) */}
        <div className="xl:col-span-7 flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col gap-5">
            {/* Header & Progress */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded uppercase">
                  Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  EST. 6 MIN REMAINING
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-500">ACCURACY:</span>
                <strong className="text-emerald-600 font-bold">100%</strong>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              ></div>
            </div>

            {/* Question Text */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Topic: {question.topic}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {question.question}
              </h3>
            </div>

            {/* Options Stack */}
            <div className="flex flex-col gap-2.5">
              {question.options.map((opt) => {
                const isSelected = selectedOption === opt.key;
                const isCorrect = opt.key === question.correctKey;

                return (
                  <div
                    key={opt.key}
                    onClick={() => setSelectedOption(opt.key)}
                    className={`
                      p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3
                      ${isSelected 
                        ? 'bg-indigo-50/80 border-indigo-300 text-slate-900 shadow-xs' 
                        : 'bg-slate-50/60 border-slate-200/70 hover:bg-slate-100/70 text-slate-700'}
                    `}
                  >
                    <div className="flex flex-col">
                      <span className={`text-xs sm:text-sm font-semibold ${isSelected ? 'text-indigo-950 font-bold' : 'text-slate-800'}`}>
                        {opt.label}
                      </span>
                      <span className="text-[11px] text-slate-500 mt-0.5">
                        {opt.description}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Blackbox Ingest Grounding Verification Drawer */}
            {selectedOption && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-900 uppercase">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Blackbox Ingest Grounding [{question.grounding.timestamp}]</span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                    {question.grounding.confidence}
                  </span>
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed pl-2 border-l-2 border-indigo-400">
                  "{question.grounding.quote}"
                </p>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                  <span>{question.grounding.instructorNote}</span>
                  <button className="text-indigo-600 hover:underline flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    <span>Jump to Audio [{question.grounding.timestamp}]</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quiz Navigation Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => {
                  if (currentQuestionIndex > 0) {
                    setCurrentQuestionIndex(currentQuestionIndex - 1);
                    setSelectedOption(null);
                  }
                }}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => {
                  if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                    setSelectedOption(null);
                  }
                }}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 flex items-center gap-1 transition shadow-xs"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Flashcard Deck (5 Cols) */}
        <div className="xl:col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col gap-4 justify-between min-h-[420px]">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-slate-500 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  Flashcard Deck ({currentCardIndex + 1}/{FLASHCARDS.length})
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-indigo-50 text-indigo-700 font-semibold rounded">
                  {card.tag}
                </span>
              </div>

              {/* 3D Flip Flashcard */}
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className="cursor-pointer min-h-[200px] p-6 rounded-2xl bg-gradient-to-br from-[#faf8ff] to-[#eaedff] border border-indigo-100 flex flex-col justify-between hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>{isFlipped ? 'ANSWER / SYNTHESIS' : 'PROMPT / RECALL'}</span>
                  <span className="flex items-center gap-1 text-indigo-600">
                    <RotateCw className="w-3 h-3" />
                    <span>Click to flip</span>
                  </span>
                </div>

                <div className="my-auto py-3">
                  {isFlipped ? (
                    <p className="text-sm font-medium text-slate-900 leading-relaxed">
                      {card.back}
                    </p>
                  ) : (
                    <h4 className="text-base font-bold text-slate-900 leading-snug">
                      {card.front}
                    </h4>
                  )}
                </div>

                <div className="text-[10px] font-mono text-slate-500 pt-2 border-t border-indigo-100/60 flex justify-between">
                  <span>SM-2 Spaced Algorithm</span>
                  <span className="capitalize text-indigo-700 font-semibold">
                    Status: {card.mastery}
                  </span>
                </div>
              </div>
            </div>

            {/* SM-2 Confidence Rating Controls */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider text-center">
                Rate Recall Confidence
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentCardIndex((currentCardIndex + 1) % FLASHCARDS.length);
                  }}
                  className="py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold font-mono transition border border-rose-100"
                >
                  Hard (1d)
                </button>
                <button 
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentCardIndex((currentCardIndex + 1) % FLASHCARDS.length);
                  }}
                  className="py-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-semibold font-mono transition border border-amber-100"
                >
                  Good (3d)
                </button>
                <button 
                  onClick={() => {
                    setIsFlipped(false);
                    setCurrentCardIndex((currentCardIndex + 1) % FLASHCARDS.length);
                  }}
                  className="py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold font-mono transition border border-emerald-100"
                >
                  Easy (7d)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
