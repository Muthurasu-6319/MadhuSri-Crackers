import React from 'react';
import { ArrowRight, Sparkles, Flame, CheckCircle2 } from 'lucide-react';

export default function PromoBanner({ onNavigate }) {
  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white via-rose-50/80 to-amber-50/70 p-7 sm:p-10 text-slate-900 shadow-xl shadow-red-950/5 border border-red-200/80">
        
        {/* Ambient festive lighting blooms */}
        <div className="absolute -left-12 -top-12 w-64 h-64 bg-red-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Left Text Content */}
          <div className="text-center md:text-left space-y-2.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-red-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Special Factory Direct Offer</span>
            </div>
            
            <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Grand Festival Family Packs at <span className="text-red-600 underline decoration-red-400/50">Wholesale Rates!</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
              Save up to 70% direct from Sivakasi factory. Safe transport delivery booked across all Tamil Nadu hubs with zero middleman markup.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-lg border border-slate-200/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> No Minimum Order
              </span>
              <span className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-lg border border-slate-200/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Free Parcel Tracking
              </span>
              <span className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-lg border border-slate-200/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Genuine Sivakasi
              </span>
            </div>
          </div>

          {/* Right Action & Diya */}
          <div className="flex items-center gap-6 sm:gap-8 shrink-0">
            <button 
              type="button"
              onClick={() => onNavigate && onNavigate('shop')} 
              className="btn-shimmer bg-gradient-to-r from-red-600 via-red-700 to-amber-600 hover:from-red-700 hover:to-amber-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm px-7 sm:px-9 py-3.5 rounded-full shadow-lg shadow-red-600/25 transition-all duration-200 hover:scale-105 flex items-center gap-2"
            >
              <span>Explore Deals</span>
              <ArrowRight className="w-4 h-4 text-yellow-300" />
            </button>

            {/* Glowing Diya Lamp */}
            <div className="w-16 h-16 sm:w-22 sm:h-22 shrink-0 diya-flame-animated drop-shadow-xl">
              <img src="/images/diya.svg" alt="Diwali Diya" className="w-full h-full object-contain" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
