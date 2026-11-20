import React from 'react';
import { ArrowRight, Sparkles, Flame } from 'lucide-react';
import { categories as defaultCategories } from '../data/products';

export default function CategoriesSection({ onNavigate, categories = defaultCategories }) {
  const handleCategoryClick = (catId) => {
    if (onNavigate) {
      onNavigate('shop', catId);
    }
  };

  const displayCategories = (categories && categories.length > 0 ? categories : defaultCategories).filter(c => c.id !== 'all');

  return (
    <section id="collections" className="py-16 sm:py-20 bg-gradient-to-b from-slate-50/60 via-white to-slate-50/40 relative overflow-hidden">
      
      {/* Decorative ambient blurred circles */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-red-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Curated Festival Collections</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
            Explore Fireworks by Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Handpicked premium Sivakasi crackers with 100% legal green formulation and vibrant visual displays.
          </p>
        </div>

        {/* Dynamic Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {displayCategories.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => handleCategoryClick(cat.id)}
              className="bg-white rounded-2xl sm:rounded-3xl p-3.5 border border-slate-100/90 shadow-sm flex flex-col justify-between group hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-600/10 hover:border-red-200 transition-all duration-300 cursor-pointer relative overflow-hidden"
            >
              {/* Top Accent Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-amber-500 opacity-0 group-hover:opacity-100 transition duration-300" />

              {/* Image Container with Ambient Pedestal */}
              <div className="overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/80 mb-3.5 aspect-square flex items-center justify-center p-2 relative">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-sm" 
                  loading="lazy"
                />
              </div>

              {/* Category Meta */}
              <div className="text-center">
                <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm mb-1.5 group-hover:text-red-600 transition line-clamp-1">
                  {cat.name}
                </h3>
                
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 group-hover:text-red-700 transition">
                  <span>Explore Now</span>
                  <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
