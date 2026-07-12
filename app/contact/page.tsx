'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name || !email || !subject || !message) {
      setError('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (!res.ok) throw new Error('Server error');

      try {
        const savedMessages = JSON.parse(localStorage.getItem('flamehouse_contact_messages') || '[]');
        const entry = {
          id: `contact-${Date.now()}`,
          name,
          email,
          subject: subject || 'General Enquiry',
          message,
          date: new Date().toISOString(),
        };
        localStorage.setItem('flamehouse_contact_messages', JSON.stringify([entry, ...savedMessages].slice(0, 20)));
      } catch {
        // Ignore local storage errors and still show success to the user.
      }

      setSuccess(true);
      setName(''); setEmail(''); setSubject(''); setMessage('');
      setTimeout(() => setSuccess(false), 5000);
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="w-full bg-[#0f0907] min-h-screen py-16 px-6 md:px-12 text-zinc-300 relative overflow-hidden">
      {}
      <div className="absolute top-[20%] left-[-15%] w-[450px] h-[450px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-15%] w-[450px] h-[450px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto flex flex-col gap-12 relative z-10">
        
        {}
        <div className="flex flex-col gap-2.5 text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-red-500 tracking-widest uppercase">Support & Queries</span>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">Get In Touch</h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Have questions about group orders, franchise, spice levels, or food prep? Send us a message and we'll reply shortly.
          </p>
        </div>

        {/* Layout: Sidebar Contact Details + Query Form */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          
          {/* LEFT COLUMN: Real Contact Info (2 Cols) */}
          <div className="md:col-span-2 flex flex-col gap-6">
            
            {/* Info details box */}
            <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col gap-6">
              <h3 className="font-bold text-white uppercase tracking-wider text-xs border-b border-white/5 pb-3.5">
                Flamehouse Headquarters
              </h3>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl shrink-0 mt-0.5">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wide">Restaurant Address</span>
                  <span className="text-zinc-200 text-xs font-medium leading-relaxed">128 Blazing Boulevard, Heatwave City, HW 90210</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-xl shrink-0 mt-0.5">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wide">Customer Hotline</span>
                  <span className="text-zinc-200 text-xs font-medium">+1 (800) 555-FIRE</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl shrink-0 mt-0.5">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wide">Email Enquiries</span>
                  <span className="text-zinc-200 text-xs font-medium">hello@flamehouse.com</span>
                </div>
              </div>
            </div>

            {/* Map Placeholder Block */}
            <div className="glass-panel-light rounded-2xl p-5 border border-white/5 flex flex-col gap-3">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wide">Store Location Map</span>
              <div className="h-40 w-full bg-zinc-950/60 rounded-xl border border-white/5 flex items-center justify-center text-center p-4">
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-xl">🗺️</span>
                  <span className="text-zinc-400 text-xs font-semibold">Heatwave City Center</span>
                  <span className="text-[10px] text-zinc-600">8 miles delivery radius around Blazing Blvd</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Query submission form (3 Cols) */}
          <div className="md:col-span-3 flex flex-col gap-4">
            
            {/* Status updates */}
            {error && (
              <div className="flex items-center gap-2.5 p-3.5 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 text-xs">
                <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2.5 p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs animate-pulse">
                <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                <span>Your message has been received. We will follow up shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 md:p-8 border border-white/5 flex flex-col gap-5">
              <h3 className="font-bold text-white uppercase tracking-wider text-xs border-b border-white/5 pb-3.5">
                Send Support Message
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-red-500/50"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">Email Address <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    required
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-red-500/50"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">Subject Line <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Catering Request"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-red-500/50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">Message Content <span className="text-red-500">*</span></label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type your questions or feedback here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-red-500/50 resize-none"
                />
              </div>

              <button type="submit" disabled={submitting} className="btn-jelly w-full py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-60">
                <Send className="h-4 w-4" /> {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
}
