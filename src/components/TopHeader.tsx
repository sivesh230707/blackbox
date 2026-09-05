'use client';

import React from 'react';
import { 
  Menu, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Radio, 
  Calendar, 
  Clock, 
  Bot,
  SlidersHorizontal,
  Bell,
  Share2
} from 'lucide-react';
import { LECTURE_METADATA } from '@/data/lectureData';

interface TopHeaderProps {
  onToggleSidebar: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onToggleSidebar,
  onToggleChat,
  isChatOpen
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu Button & Lecture Title Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden transition"
            aria-label="Toggle Navigation Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex flex-col min-w-0">
            {/* Breadcrumb & Processing Status */}
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 flex-wrap">
              <span className="font-semibold text-indigo-600 hover:underline cursor-pointer">
                {LECTURE_METADATA.courseCode}
              </span>
              <span>/</span>
              <span className="text-slate-700 font-medium">
                {LECTURE_METADATA.courseName}
              </span>
              <span>/</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Verified Capture
              </span>
            </div>

            {/* Active Lecture Title */}
            <div className="flex items-center gap-2.5 mt-0.5">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate tracking-tight">
                {LECTURE_METADATA.lectureNumber}: {LECTURE_METADATA.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Right Side: Search, Node Ingest Status, Chat Toggle, Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Search */}
          <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs text-slate-400 w-52 xl:w-64 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search concepts, formulas..." 
              className="bg-transparent border-none outline-none text-xs text-slate-800 placeholder-slate-400 w-full"
            />
            <kbd className="hidden xl:inline-block font-mono text-[10px] bg-white border border-slate-200 px-1 rounded text-slate-500">
              ⌘K
            </kbd>
          </div>

          {/* Processing Status Chip */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] font-mono text-slate-700">
            <Radio className="w-3 h-3 text-indigo-600 animate-pulse" />
            <span className="font-semibold text-slate-800">Node 04: Ingest Online</span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-indigo-50 text-indigo-700 font-medium">
              48kHz FLAC
            </span>
          </div>

          {/* Persistent AI Assistant Toggle Button */}
          <button
            onClick={onToggleChat}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-xs transition-all shadow-xs
              ${isChatOpen 
                ? 'bg-indigo-600 text-white shadow-indigo-200' 
                : 'bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50'}
            `}
            title="Toggle AI Study Assistant Panel"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">AI Study Assistant</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          {/* User Icon */}
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
            AM
          </div>
        </div>
      </div>
    </header>
  );
};
