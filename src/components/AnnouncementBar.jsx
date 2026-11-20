import React from 'react';
import { Sparkles, ShieldCheck, Truck, PhoneCall } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <aside aria-label="Announcement" className="bg-gradient-to-r from-white via-rose-50/70 to-amber-50/60 text-slate-800 text-xs font-semibold py-1.5 sm:py-2 px-2.5 sm:px-4 border-b border-rose-200/60 relative z-50 overflow-hidden shadow-2xs w-full">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2.5 text-center sm:text-left">
        
        {/* Left Message */}
        <div className="flex items-center gap-1.5 sm:gap-2 justify-center flex-wrap">
          <span className="inline-flex items-center gap-1 bg-red-600 text-white px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider shadow-2xs shrink-0">
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
            2026 Season Open
          </span>
          <span className="text-slate-700 text-[10px] sm:text-xs">
            Direct Sivakasi Factory Rates | <span className="text-red-600 font-extrabold">Wholesale Combos</span>
          </span>
        </div>

        {/* Right Quick Guarantee Chips (Hidden on small mobile to prevent any horizontal overflow) */}
        <div className="hidden sm:flex items-center gap-3 sm:gap-5 justify-center text-[11px] text-slate-600 flex-wrap">
          <span className="inline-flex items-center gap-1 hover:text-red-600 transition font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Genuine Sivakasi</span>
          </span>
          <span className="hidden md:inline-flex items-center gap-1 hover:text-red-600 transition font-medium">
            <Truck className="w-3.5 h-3.5 text-amber-600" />
            <span>Safe All-TN Transport</span>
          </span>
          <a 
            href="https://wa.me/919790623441" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 transition font-bold"
          >
            <PhoneCall className="w-3 h-3 text-emerald-600" />
            <span>+91 9790623441</span>
          </a>
        </div>

      </div>
    </aside>
  );
}
