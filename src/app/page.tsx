'use client';

import React, { useState } from 'react';
import { Sidebar, TabType } from '@/components/Sidebar';
import { TopHeader } from '@/components/TopHeader';
import { NotesView } from '@/components/NotesView';
import { FormulasView } from '@/components/FormulasView';
import { QuizzesView } from '@/components/QuizzesView';
import { ChatPanel } from '@/components/ChatPanel';
import { 
  FileText, 
  Calculator, 
  HelpCircle, 
  Sparkles, 
  Download, 
  Share2, 
  Calendar, 
  Clock, 
  User, 
  Radio, 
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { LECTURE_METADATA } from '@/data/lectureData';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('notes');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col antialiased">
      {/* 1. Fixed Left Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main App Canvas Container */}
      <div className="flex-1 flex flex-col lg:pl-72 xl:pr-96 transition-all duration-300">
        {/* 2. Top Header Navigation */}
        <TopHeader 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onToggleChat={() => setIsChatOpen(!isChatOpen)}
          isChatOpen={isChatOpen}
        />

        {/* 3. Main Content Area */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 pt-6">
          <div className="max-w-6xl mx-auto flex flex-col gap-6">
            {/* Context Metadata Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                  <span>{LECTURE_METADATA.courseCode} • {LECTURE_METADATA.date}</span>
                  <span>•</span>
                  <span>{LECTURE_METADATA.duration}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {LECTURE_METADATA.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-600 pt-0.5">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{LECTURE_METADATA.professor}</span>
                  <span className="text-slate-300">•</span>
                  <span>{LECTURE_METADATA.room}</span>
                </div>
              </div>

              {/* Sub-navigation Quick View Switcher Pills */}
              <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 self-start sm:self-center shrink-0">
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition
                    ${activeTab === 'notes' 
                      ? 'bg-white text-indigo-700 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'}
                  `}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Notes</span>
                </button>

                <button
                  onClick={() => setActiveTab('formulas')}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition
                    ${activeTab === 'formulas' 
                      ? 'bg-white text-indigo-700 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'}
                  `}
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Formulas</span>
                </button>

                <button
                  onClick={() => setActiveTab('quizzes')}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition
                    ${activeTab === 'quizzes' 
                      ? 'bg-white text-indigo-700 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'}
                  `}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Quizzes</span>
                </button>
              </div>
            </div>

            {/* Dynamic Content View Router */}
            {activeTab === 'notes' && <NotesView />}
            {activeTab === 'formulas' && <FormulasView />}
            {activeTab === 'quizzes' && <QuizzesView />}
          </div>
        </main>
      </div>

      {/* 4. Persistent Right-Hand AI Chatbot Panel */}
      <ChatPanel 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </div>
  );
}
