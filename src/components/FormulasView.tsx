'use client';

import React, { useState } from 'react';
import { 
  Calculator, 
  Copy, 
  Check, 
  Camera, 
  BookOpen, 
  Code2, 
  Sparkles, 
  FileCode, 
  ArrowRight,
  Sliders
} from 'lucide-react';
import { FORMULAS, FormulaItem } from '@/data/lectureData';

export const FormulasView: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Interactive f_max calculator state
  const [tcq, setTcq] = useState<number>(1.2);
  const [tcomb, setTcomb] = useState<number>(4.5);
  const [tsetup, setTsetup] = useState<number>(1.8);

  const copyLatex = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // f_max calculation in MHz: 1000 / (tcq + tcomb + tsetup)
  const totalDelayNs = tcq + tcomb + tsetup;
  const fmaxMHz = totalDelayNs > 0 ? (1000 / totalDelayNs).toFixed(2) : '0';

  return (
    <div className="flex flex-col gap-6 pb-12 animate-fadeIn">
      {/* Formula Sheet Header Banner */}
      <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold block">
                Formal Mathematics & Derivations
              </span>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Extracted Lecture Formula Sheets
              </h2>
            </div>
          </div>
          <span className="text-xs font-mono bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-lg font-semibold">
            LaTeX Formatted • Blackboard OCR
          </span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          Formulas automatically parsed from Dr. Ramanathan's handwritten chalkboard derivations and course slide decks. Each equation is available as formatted LaTeX code ready for export to Overleaf, Notion, or Obsidian.
        </p>
      </section>

      {/* Card-Based Layout for Extracted Formulas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {FORMULAS.map((formula) => {
          const isCopied = copiedId === formula.id;

          return (
            <div 
              key={formula.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-4 hover:border-slate-300 transition"
            >
              <div className="flex flex-col gap-3">
                {/* Card Title & Module Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">
                      {formula.module}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {formula.title}
                    </h3>
                  </div>

                  {/* Copy LaTeX Button */}
                  <button
                    onClick={() => copyLatex(formula.id, formula.latex)}
                    className={`
                      flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition shadow-xs shrink-0
                      ${isCopied 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}
                    `}
                    title="Copy LaTeX notation"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span className="font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copy LaTeX</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Distinct Code / Math Block Container */}
                <div className="bg-[#0f172a] text-slate-100 p-4 rounded-xl font-mono text-sm sm:text-base flex items-center justify-center text-center shadow-inner relative overflow-hidden group">
                  <div className="absolute top-2 left-3 text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                    MATH BLOCK
                  </div>
                  <div className="py-2 px-1 tracking-wide font-semibold text-indigo-300">
                    {formula.displayMath}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-normal">
                  {formula.description}
                </p>
              </div>

              {/* Card Footer: Blackboard OCR Grounding */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500 font-mono">
                <div className="flex items-center gap-1.5 text-indigo-600">
                  <Camera className="w-3.5 h-3.5" />
                  <span className="font-medium">{formula.source}</span>
                </div>
                <span className="text-[10px] text-slate-400">Verified Blackboard Source</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Timing & Frequency Calculator */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold block">
                Interactive Practice Sandbox
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Live Maximum Clock Frequency Calculator (f_max)
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-lg">
            Formula 2 Evaluator
          </span>
        </div>

        <p className="text-xs text-slate-600">
          Test timing margins derived in class. Adjust flip-flop propagation delay (t_cq), combinational gate logic delay (t_comb), and register setup delay (t_setup) to solve for the hardware clock ceiling.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 flex justify-between">
              <span>t_cq (Clock-to-Q):</span>
              <span className="font-mono text-indigo-600">{tcq} ns</span>
            </label>
            <input 
              type="range" 
              min="0.5" 
              max="5" 
              step="0.1" 
              value={tcq} 
              onChange={(e) => setTcq(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 flex justify-between">
              <span>t_comb (Gate delay):</span>
              <span className="font-mono text-indigo-600">{tcomb} ns</span>
            </label>
            <input 
              type="range" 
              min="1" 
              max="15" 
              step="0.5" 
              value={tcomb} 
              onChange={(e) => setTcomb(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 flex justify-between">
              <span>t_setup (Setup delay):</span>
              <span className="font-mono text-indigo-600">{tsetup} ns</span>
            </label>
            <input 
              type="range" 
              min="0.5" 
              max="5" 
              step="0.1" 
              value={tsetup} 
              onChange={(e) => setTsetup(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Real-time calculated output */}
        <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Total Critical Path Delay</span>
            <span className="text-sm font-mono text-slate-200">
              {tcq}ns + {tcomb}ns + {tsetup}ns = <strong className="text-white">{totalDelayNs.toFixed(2)} ns</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 uppercase">Computed f_max:</span>
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {fmaxMHz} MHz
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
