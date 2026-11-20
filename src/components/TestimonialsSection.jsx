import React from 'react';
import { Star } from 'lucide-react';
import { testimonials } from '../data/products';

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-14 bg-slate-50/70 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4">
            <span className="section-title-line"></span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              What Our Customers Say
            </h2>
            <span className="section-title-line"></span>
          </div>
        </div>

        {/* 3 Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition"
            >
              <img 
                src={item.avatar} 
                alt={item.name} 
                className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-red-100" 
              />
              <div className="space-y-1">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 italic">"{item.comment}"</p>
                <div className="font-bold text-red-600 text-xs sm:text-sm pt-1">{item.name}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

