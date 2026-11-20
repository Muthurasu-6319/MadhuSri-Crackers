import React from 'react';
import { Award, Package, Gift, Headphones, ShieldCheck, Truck, Percent, Sparkles } from 'lucide-react';

export default function FeaturesBar() {
  const features = [
    {
      icon: Award,
      badge: 'Genuine',
      gradient: 'from-amber-500 to-amber-600',
      title: '100% Genuine Sivakasi',
      desc: 'Direct factory sealed legal green crackers'
    },
    {
      icon: Truck,
      badge: 'All-TN',
      gradient: 'from-red-600 to-rose-600',
      title: 'Safe Parcel Transport',
      desc: 'Reliable parcel booking to all 38 districts'
    },
    {
      icon: Percent,
      badge: 'Up to 70%',
      gradient: 'from-emerald-500 to-teal-600',
      title: 'Factory Wholesale Price',
      desc: 'Save huge on retail counter rates'
    },
    {
      icon: Headphones,
      badge: 'Live',
      gradient: 'from-blue-600 to-indigo-600',
      title: 'WhatsApp Support',
      desc: 'Instant order assistance & dispatch tracking'
    }
  ];

  return (
    <section className="relative -mt-8 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-100 p-5 sm:p-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                className={`flex items-center gap-4 pt-4 sm:pt-0 group transition-all duration-300 ${
                  index > 0 ? 'sm:pl-6' : ''
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center shrink-0 shadow-lg shadow-slate-900/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight group-hover:text-red-600 transition">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-snug">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
