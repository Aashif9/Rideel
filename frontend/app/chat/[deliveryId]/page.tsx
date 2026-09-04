'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiServices } from '@/services/apiServices';
import { Message, User, Delivery } from '@/types';
import { Send, MapPin, Phone, ArrowLeft, ShieldCheck, Image as ImageIcon } from 'lucide-react';

export default function DeliveryChatPage() {
  const params = useParams();
  const router = useRouter();
  const deliveryId = params.deliveryId as string;

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    apiServices.getCurrentUser().then(setCurrentUser);
    apiServices.getDeliveries().then(dList => {
      const found = dList.find(d => d.id === deliveryId);
      setDelivery(found || null);
    });

    apiServices.getMessages(deliveryId).then(setMessages);
  }, [deliveryId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = await apiServices.sendMessage(deliveryId, inputText.trim());
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
  };

  const handleShareLocation = async () => {
    const locMsg = await apiServices.sendMessage(deliveryId, '📍 Shared Live Location Pin (Benz Circle, Vijayawada)');
    setMessages(prev => [...prev, locMsg]);
  };

  if (!delivery || !currentUser) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  const otherUser = currentUser.id === delivery.sender_id ? delivery.traveler : delivery.sender;

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[80vh] bg-white rounded-3xl shadow-xl border border-surface-container-high overflow-hidden animate-in fade-in">
      {/* Header */}
      <div className="p-4 bg-[#002b5c] text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition active:scale-90"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <img
            src={otherUser?.profile_photo}
            alt={otherUser?.full_name}
            className="w-10 h-10 rounded-full object-cover border-2 border-amber-400"
          />
          <div>
            <h3 className="font-black text-sm">{otherUser?.full_name}</h3>
            <span className="text-[10px] text-amber-300 font-bold block flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online • Verified Traveler
            </span>
          </div>
        </div>
        <Phone className="w-5 h-5 text-amber-400 cursor-pointer hover:scale-110 transition" />
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
        {messages.map((m) => {
          const isMe = m.sender_id === currentUser.id;
          return (
            <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-3 rounded-2xl text-xs space-y-1 ${
                isMe ? 'bg-[#002b5c] text-white rounded-br-none shadow-sm' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
              }`}>
                <div>{m.message}</div>
                <div className={`text-[9px] text-right ${isMe ? 'text-slate-300' : 'text-slate-400'}`}>
                  {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Location Share Action */}
      <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center gap-2">
        <button
          onClick={handleShareLocation}
          className="text-[11px] font-extrabold text-[#002b5c] bg-white px-3.5 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 transition active:scale-95 flex items-center gap-1 shadow-xs"
        >
          <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Share Current GPS Location
        </button>
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type message to traveler..."
          className="flex-1 bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#002b5c]"
        />
        <button
          type="submit"
          className="bg-amber-400 hover:bg-amber-500 text-slate-950 p-3 rounded-2xl shadow-md active:scale-95 transition-all"
        >
          <Send className="w-4 h-4 text-slate-950 stroke-[3px]" />
        </button>
      </form>
    </div>
  );
}
