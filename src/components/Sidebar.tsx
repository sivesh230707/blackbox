'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Calculator, 
  HelpCircle, 
  ShieldCheck, 
  Cpu, 
  ChevronDown, 
  Languages, 
  GraduationCap, 
  Sparkles,
  Radio,
  BookMarked
} from 'lucide-react';
import { LECTURE_METADATA } from '@/data/lectureData';

export type TabType = 'notes' | 'formulas' | 'quizzes';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose
}) => {
  const navTabs: { id: TabType; label: string; icon: React.ElementType; badge?: string; desc: string }[] = [
    {
      id: 'notes',
      label: 'Structured Notes',
      icon: FileText,
      badge: 'Synthesized',
      desc: 'Categorized summaries & key terms'
    },
    {
      id: 'formulas',
      label: 'Formula Sheets',
      icon: Calculator,
      badge: '4 LaTeX',
      desc: 'Extracted equations & math cards'
    },
    {
      id: 'quizzes',
      label: 'Auto-Quizzes / Flashcards',
      icon: HelpCircle,
      badge: '10 Qs • 18 Cards',
      desc: 'Active recall & SM-2 repetition'
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside 
        className={`
          fixed top-0 left-0 h-screen w-72 bg-white border-r border-slate-200/80 flex flex-col z-50 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          shadow-[0_1px_10px_rgba(0,0,0,0.03)]
        `}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100 bg-[#f8faff]">
          <Link href="/" className="flex items-center gap-3 hover:opacity-85 transition-opacity" title="Return to Landing Page">
            <div className="w-8 h-8 rounded-lg bg-[#0b1c30] flex items-center justify-center text-white shadow-sm ring-1 ring-black/5">
              <div className="flex items-center gap-0.5">
                <span className="w-1 h-3 bg-indigo-400 rounded-full animate-pulse"></span>
                <span className="w-1 h-4 bg-white rounded-full"></span>
                <span className="w-1 h-2 bg-indigo-300 rounded-full"></span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-slate-900 uppercase">
                BLACKBOX
              </span>
              <span className="text-[10px] text-slate-500 font-mono tracking-wider">
                STUDENT DESK
              </span>
            </div>
          </Link>
          <span className="text-[10px] font-mono uppercase font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
            WORKSPACE
          </span>
        </div>

        {/* Navigation & Content Area */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-5">
            {/* Active Course Selector Box */}
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-indigo-600" />
                  Active Course
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-indigo-100/70 text-indigo-700 rounded font-semibold">
                  EE-201
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 truncate">
                  Digital Logic & Design
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <Radio className="w-2.5 h-2.5 text-emerald-500 animate-pulse" />
                <span>Node 04 Ingest • Lec 04 Active</span>
              </div>
            </div>

            {/* Primary Tab Navigation */}
            <nav className="flex flex-col gap-1.5">
              <div className="px-2 pb-1 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Lecture Synthesis Tabs
              </div>

              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (onClose) onClose();
                    }}
                    className={`
                      w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all relative
                      ${isActive 
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                    `}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${isActive ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0 pr-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold tracking-tight">
                          {tab.label}
                        </span>
                        {tab.badge && (
                          <span className={`text-[9px] font-mono font-medium px-1.5 py-0.5 rounded-full ${
                            isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {tab.badge}
                          </span>
                        )}
                      </div>
                      <span className={`text-[11px] leading-tight mt-0.5 truncate ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                        {tab.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Ingest Telemetry Module */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1">
                  <Languages className="w-3 h-3 text-indigo-600" />
                  Multilingual Engine
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded">
                  99.1% High
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-700">
                <span className="font-medium">Sarvam AI ASR</span>
                <span className="font-mono text-[11px] text-slate-500">ENG • HIN • TAM</span>
              </div>
            </div>
          </div>

          {/* Bottom Fixed Area: Privacy Mode & Student Profile */}
          <div className="flex flex-col gap-3 pt-3 border-t border-slate-100">
            {/* Privacy Mode: Local Processing Status Badge */}
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col gap-1 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs">
                <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>Privacy Mode: Local Processing</span>
              </div>
              <p className="text-[11px] text-emerald-700/90 pl-7 leading-relaxed">
                100% On-Device Neural Compute. Zero audio or blackboard photos ever leak to external cloud servers.
              </p>
              <div className="pl-7 pt-1 flex items-center gap-1.5 text-[10px] font-mono text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Hardware Edge Guard: Active</span>
              </div>
            </div>

            {/* User Profile Card */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  AM
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-slate-800 truncate">
                    Arjun Mehta
                  </span>
                  <span className="text-[10px] text-slate-400 truncate font-mono">
                    EE & CS Sophomore
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-semibold">
                Online
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
