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
      <div className="p-4 bg-primary text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1 hover:bg-white/10 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <img
            src={otherUser?.profile_photo}
            alt={otherUser?.full_name}
            className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400"
          />
          <div>
            <div className="font-extrabold text-sm flex items-center gap-1">
              {otherUser?.full_name} <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-[10px] text-slate-300">Delivery ID: {delivery.id}</div>
          </div>
        </div>

        <button
          onClick={() => alert(`Calling ${otherUser?.full_name} (${otherUser?.phone})`)}
          className="p-2.5 bg-emerald-500 text-slate-950 rounded-full font-bold hover:bg-emerald-400 transition"
          title="Call User"
        >
          <Phone className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-surface-container-low">
        {messages.map((msg) => {
          const isMine = msg.sender_id === currentUser.id;
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-3 rounded-2xl text-xs space-y-1 ${
                isMine ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-slate-900 shadow-xs rounded-tl-none border'
              }`}>
                <p>{msg.message}</p>
                <div className={`text-[9px] text-right ${isMine ? 'text-slate-300' : 'text-slate-400'}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Location Share Action */}
      <div className="px-4 py-2 bg-slate-50 border-t flex items-center gap-2">
        <button
          onClick={handleShareLocation}
          className="text-[11px] font-bold text-primary bg-surface-container px-3 py-1 rounded-full border border-primary-fixed hover:bg-primary hover:text-white transition flex items-center gap-1"
        >
          <MapPin className="w-3 h-3 text-emerald-600" /> Share Pickup Location
        </button>
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type message to traveler..."
          className="flex-1 bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-primary"
        />
        <button
          type="submit"
          className="bg-primary hover:bg-primary-container text-white p-2.5 rounded-xl shadow-md transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
