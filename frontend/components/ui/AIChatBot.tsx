'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, X, Send, ArrowRight, ShieldCheck, MapPin, Truck, HelpCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  quickActions?: Array<{ label: string; href: string }>;
}

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: "👋 Hi! I am **RIDEEL Express AI Assistant**.\n\nHow can I help with your intercity delivery or travel earnings today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickActions: [
        { label: '📦 Track Parcel RD784521', href: '/deliveries/RD784521' },
        { label: '🚀 How to Send a Parcel', href: '/send' },
        { label: '🚗 How Travelers Earn', href: '/trips' }
      ]
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const queryText = textToSend || input;
    if (!queryText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: queryText })
      });

      const data = await res.json();
      setIsTyping(false);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.reply || "I am processing your logistics request. How else can I assist?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: data.quickActions || []
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setIsTyping(false);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: "I am having trouble connecting right now. Please try again or check your tracking dashboard.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-30">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group bg-slate-900 text-white p-3.5 md:p-4 rounded-full shadow-2xl hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 border-2 border-emerald-500/50 flex items-center gap-2.5"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-emerald-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          </div>
          <span className="hidden md:inline font-bold text-xs pr-1">Ask RIDEEL AI</span>
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider">
            AI Bot
          </span>
        </button>
      )}

      {/* Collapsible Chatbot Modal */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[380px] md:w-[400px] h-[520px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center border border-slate-700">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
              <div>
                <div className="font-extrabold text-sm flex items-center gap-1.5 text-white">
                  RIDEEL Express AI <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-black px-1.5 py-0.5 rounded border border-emerald-500/40">ONLINE</span>
                </div>
                <div className="text-[10px] text-slate-400">Intercity Logistics Assistant</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
              aria-label="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-br-none font-medium'
                      : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-line">
                    {msg.text.split('\n').map((line, idx) => {
                      // Basic bold parsing formatting
                      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                      return (
                        <p key={idx} dangerouslySetInnerHTML={{ __html: formattedLine }} className={idx > 0 ? 'mt-1' : ''} />
                      );
                    })}
                  </div>
                </div>

                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>

                {/* Quick Action Link Chips */}
                {msg.quickActions && msg.quickActions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[85%]">
                    {msg.quickActions.map((action, idx) => (
                      <Link
                        key={idx}
                        href={action.href}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 bg-white hover:bg-primary hover:text-white text-primary text-[11px] font-extrabold px-2.5 py-1 rounded-full border border-primary/20 shadow-xs transition"
                      >
                        <span>{action.label}</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs bg-white p-3 rounded-2xl border border-slate-200 w-24">
                <Bot className="w-4 h-4 text-emerald-500 animate-bounce" />
                <span className="animate-pulse font-bold text-[10px]">Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="bg-white px-3 py-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleSend("Where is my parcel RD784521?")}
              className="shrink-0 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full transition"
            >
              📦 Track Delivery
            </button>
            <button
              onClick={() => handleSend("How does Escrow & OTP work?")}
              className="shrink-0 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full transition"
            >
              🔒 Escrow & OTP
            </button>
            <button
              onClick={() => handleSend("What items are prohibited?")}
              className="shrink-0 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full transition"
            >
              🚫 Prohibited Items
            </button>
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask RIDEEL AI assistant..."
              className="flex-1 bg-slate-100 border border-slate-200 rounded-full px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-primary focus:bg-white transition"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-full bg-primary disabled:opacity-50 text-white flex items-center justify-center hover:bg-primary-container transition shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
