'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Mic, 
  X, 
  BookOpen, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  RefreshCw,
  CornerDownLeft
} from 'lucide-react';
import { INITIAL_CHAT_MESSAGES, ChatMessage, LECTURE_METADATA } from '@/data/lectureData';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsTyping(true);

    // Simulate grounded AI response
    setTimeout(() => {
      let aiResponseText = '';
      let citations = [
        {
          label: 'Lec 04 • 19:14',
          time: '19:14',
          source: 'Chalkboard Derivation Section 2'
        }
      ];

      const lower = text.toLowerCase();
      if (lower.includes('mealy') || lower.includes('moore')) {
        aiResponseText = 'In Dr. Ramanathan\'s comparison at 09:30, the key architectural distinction is that **Mealy outputs depend directly on both present state AND immediate primary inputs**, which means input glitches can propagate through combinational logic asynchronously.\n\nIn a **Moore machine**, outputs depend exclusively on the current state flip-flops, ensuring glitch-free transitions aligned with the clock edge.';
        citations = [
          { label: 'Lec 04 • 09:30', time: '09:30', source: 'Mealy vs Moore Timing Diagram' }
        ];
      } else if (lower.includes('jk') || lower.includes('excitation') || lower.includes('flip')) {
        aiResponseText = 'For a JK flip-flop, the excitation table specifies the required inputs $(J, K)$ to achieve a given state transition:\n\n- **0 → 0**: $J = 0, K = X$ (No change / Reset)\n- **0 → 1**: $J = 1, K = X$ (Set / Toggle)\n- **1 → 0**: $J = X, K = 1$ (Reset / Toggle)\n- **1 → 1**: $J = X, K = 0$ (No change / Set)\n\nProf. Ramanathan noted that utilizing the don\'t-care conditions $(X)$ in Karnaugh maps yields minimal SOP logic for synchronous counter control lines.';
        citations = [
          { label: 'Blackboard OCR 18:05', time: '18:05', source: 'JK Excitation Matrix' }
        ];
      } else if (lower.includes('setup') || lower.includes('clock') || lower.includes('frequency') || lower.includes('skew')) {
        aiResponseText = 'The maximum clock frequency $f_{max}$ is governed by the critical path delay:\n\n$$f_{max} \\le \\frac{1}{t_{cq} + t_{comb} + t_{setup}}$$\n\nIf the clock skew $t_{skew}$ across physical board traces exceeds the margin $(t_{cq,min} + t_{logic,min} - t_{hold})$, hold-time race violations will corrupt subsequent register stages.';
        citations = [
          { label: 'Blackboard OCR 39:40', time: '39:40', source: 'Timing Margin Theorem' }
        ];
      } else {
        aiResponseText = `According to **Lecture 04** notes by Prof. Ramanathan, synchronous systems are designed so that all registers trigger simultaneously on the active clock transition. This guarantees deterministic state sequencing and avoids cumulative delay ripple.`;
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  const suggestedQuestions = [
    'Explain Mealy vs Moore outputs',
    'Why do synchronous counters avoid glitches?',
    'What is the JK excitation equation?'
  ];

  return (
    <>
      {/* Mobile backdrop for chat when expanded */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 xl:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 right-0 h-screen w-full sm:w-96 bg-white border-l border-slate-200/80 flex flex-col z-50 transition-transform duration-300 ease-in-out shadow-[-1px_0_15px_rgba(0,0,0,0.04)]
          ${isOpen ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'}
        `}
      >
        {/* Panel Header */}
        <div className="h-16 px-4 sm:px-5 border-b border-slate-100 flex items-center justify-between bg-[#f8faff] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900">
                  Blackbox AI Assistant
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 truncate">
                Grounded: EE-201 Lec 04
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              99.1% Grounded
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 xl:hidden transition ml-1"
              aria-label="Close Chat Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Knowledge Scope & Status Chip */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-[11px] text-slate-500 flex items-center justify-between font-mono shrink-0">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            Strict Lecture Grounding: Active
          </span>
          <span className="text-slate-400">Zero Hallucination</span>
        </div>

        {/* Message History Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-1`}
              >
                {/* Sender & Timestamp */}
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 px-1">
                  <span>{isUser ? 'You' : 'Blackbox Study Bot'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`
                    p-3.5 rounded-2xl max-w-[90%] text-xs leading-relaxed transition-all shadow-2xs
                    ${isUser 
                      ? 'bg-indigo-600 text-white rounded-br-xs font-medium' 
                      : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-bl-xs'}
                  `}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Citations block for AI messages */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex flex-col gap-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                        Grounded Sources:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.citations.map((cite, i) => (
                          <div
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-mono text-indigo-700 shadow-2xs"
                          >
                            <BookOpen className="w-2.5 h-2.5 text-indigo-500" />
                            <span>{cite.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono py-1 px-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]"></span>
              <span>Synthesizing from lecture notes...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Chips */}
        <div className="px-3.5 py-2 border-t border-slate-100 bg-white flex flex-col gap-1 shrink-0">
          <span className="text-[10px] font-mono text-slate-400 uppercase">
            Suggested Prompts:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-800 transition text-left truncate max-w-full"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Input Form */}
        <div className="p-3.5 border-t border-slate-200/80 bg-[#fbfbfe] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <div className="flex-1 relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-inner focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask about this lecture..."
                className="w-full text-xs text-slate-800 placeholder-slate-400 outline-none bg-transparent pr-6"
              />
              <button
                type="button"
                className="text-slate-400 hover:text-indigo-600 transition"
                title="Voice Input (On-Device ASR)"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm shrink-0"
              title="Send Message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 px-1">
            <span>Press Enter to send</span>
            <span>Local Neural LLM</span>
          </div>
        </div>
      </aside>
    </>
  );
};
