import React from 'react';
import { ShieldCheck, PackageCheck, Smile, Trophy } from 'lucide-react';

export default function WhyChooseUsSection() {
  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Quality-Assured Products',
      desc: 'Strict quality standards directly from Sivakasi.'
    },
    {
      icon: PackageCheck,
      title: 'Carefully Packed Orders',
      desc: 'Sturdy moisture-proof shock packaging.'
    },
    {
      icon: Smile,
      title: 'Customer-Friendly Service',
      desc: 'Instant WhatsApp response & order tracking.'
    },
    {
      icon: Trophy,
      title: 'Great Value for Money',
      desc: 'Direct factory discounts up to 80% OFF.'
    }
  ];

  return (
    <section id="why-choose-us" className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4">
            <span className="section-title-line"></span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Choose Us?
            </h2>
            <span className="section-title-line"></span>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div key={index} className="p-4 rounded-2xl hover:bg-slate-50 transition">
                <div className="w-12 h-12 mx-auto rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">{pillar.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{pillar.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

