import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  return (
    <aside aria-label="WhatsApp Contact" className="fixed bottom-6 left-6 z-40 group">
      {/* Outer Pulse Wave Ring */}
      <div className="absolute -inset-1.5 bg-emerald-500 rounded-full blur-sm opacity-50 group-hover:opacity-80 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />

      <a 
        href="https://wa.me/919790623441?text=Vanakkam%20Madhu%20Sri%20Crackers%2C%20I%20would%20like%20to%20get%20the%20Festival%20Price%20List%20and%20order%20crackers!" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Chat directly on WhatsApp with Madhu Sri Crackers"
        className="relative bg-gradient-to-r from-emerald-500 to-[#25D366] hover:from-emerald-600 hover:to-[#20ba59] text-white p-3.5 sm:p-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5 border border-emerald-300/40"
      >
        <MessageCircle className="w-6 h-6 sm:w-6.5 sm:h-6.5 fill-current" />
        
        {/* Expandable Text Pill on Hover */}
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-black tracking-wide pr-1">
          Chat with Sivakasi Hub
        </span>
      </a>
    </aside>
  );
}
