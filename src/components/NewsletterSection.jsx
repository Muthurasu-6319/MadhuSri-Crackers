import React, { useState } from 'react';
import { Mail } from 'lucide-react';

export default function NewsletterSection({ onSubscribe }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      onSubscribe(email);
      setEmail('');
    }
  };

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-rose-50/80 border border-rose-100/90 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        
        {/* Left Notice */}
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-red-600/30">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
              Stay Updated with Our Latest Offers
            </h3>
            <p className="text-xs text-slate-500">
              Subscribe to receive festival deals and exciting updates.
            </p>
          </div>
        </div>

        {/* Right Form */}
        <form onSubmit={handleSubmit} className="w-full md:w-auto flex-1 max-w-md flex items-center gap-2">
          <input 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address" 
            className="w-full px-4 py-2.5 rounded-full border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-white"
          />
          <button 
            type="submit" 
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-md shadow-red-600/20 shrink-0 transition"
          >
            Subscribe
          </button>
        </form>

      </div>
    </section>
  );
}

