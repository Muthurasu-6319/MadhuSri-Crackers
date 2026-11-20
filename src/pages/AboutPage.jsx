import React from 'react';
import { Award, ShieldCheck, HeartHandshake, Sparkles, CheckCircle, Flame, Users, Clock, ArrowRight } from 'lucide-react';

export default function AboutPage({ onNavigate }) {
  return (
    <div className="bg-white text-slate-800 animate-fadeIn">
      {/* 1. Hero Header */}
      <section className="relative bg-gradient-to-br from-rose-50/70 via-white to-amber-50/50 text-slate-900 py-16 sm:py-22 overflow-hidden border-b border-rose-100/70">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400 via-red-600 to-transparent pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Spreading Happiness with Every Spark</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 text-slate-900">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-amber-600">Madhu Sri Crackers</span>
          </h1>
          <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Bringing brightness, joy, and unforgettable festive memories to thousands of families across Tamil Nadu with authentic, high-quality fireworks.
          </p>
        </div>
      </section>

      {/* 2. Brand Story & Heritage */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Image / Logo Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative p-6 bg-gradient-to-b from-rose-50 to-white rounded-3xl border border-rose-100 shadow-xl max-w-sm w-full text-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 mx-auto mb-4 p-2 bg-white rounded-full shadow-md border-4 border-yellow-400/80">
                <img 
                  src="/madhusri.png" 
                  alt="Madhu Sri Crackers Official Emblem" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-black text-xl text-slate-900">ஸ்ரீ மதுரை வீரன் துணை</h3>
              <p className="text-xs text-red-600 font-bold uppercase tracking-wider mt-1">Genuine Sivakasi Fireworks Brand</p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-6 text-xs text-slate-600 font-semibold">
                <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-green-600" /> Factory Direct</span>
                <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-green-600" /> 100% Tested</span>
                <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-green-600" /> Safe Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Story Text */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-block text-xs font-extrabold text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-100">
              Our Tradition & Story
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Crafting Safe, Vibrant, & Majestic Celebrations for Every Family
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Based in <b>Veerasigamani, Tenkasi</b>, <b>Madhu Sri Crackers</b> was founded with a singular dedication: to provide families with genuine, premium quality fireworks directly at wholesale festival rates without any compromises on safety and sparkle.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We work closely with certified manufacturers in Sivakasi to curate the most thrilling assortment of flower pots, spinning chakkars, wire sparklers, aerial sky shots, and festive family gift hampers. Every box is meticulously inspected, moisture-sealed, and safely packed to reach you in perfect festive condition.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Certified Green Crackers</h4>
                  <p className="text-xs text-slate-500">Eco-conscious formulas with reduced emission.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Wholesale Pricing</h4>
                  <p className="text-xs text-slate-500">Direct factory rates with big festival savings.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Milestone Stats */}
      <section className="bg-gradient-to-r from-[#b31217] via-[#d32f2f] to-[#991515] py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-red-400/40">
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-amber-300">15,000+</div>
              <div className="text-xs sm:text-sm text-rose-100 font-medium mt-1">Happy Families Celebrated</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-amber-300">200+</div>
              <div className="text-xs sm:text-sm text-rose-100 font-medium mt-1">Cracker & Firework Varieties</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-amber-300">100%</div>
              <div className="text-xs sm:text-sm text-rose-100 font-medium mt-1">Tested & Certified Products</div>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-amber-300">Fast & Safe</div>
              <div className="text-xs sm:text-sm text-rose-100 font-medium mt-1">Moisture-Proof Packaging</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why Families Trust Us (4 Pillars) */}
      <section className="py-16 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Why Choose Madhu Sri Crackers?</h2>
            <p className="text-sm text-slate-500 mt-2">What sets us apart as your preferred festival fireworks partner</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center space-y-3 hover:shadow-md transition">
              <div className="w-12 h-12 mx-auto rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Award className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Uncompromised Quality</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every firework has vibrant color saturation, reliable ignition, and consistent blast height.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center space-y-3 hover:shadow-md transition">
              <div className="w-12 h-12 mx-auto rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Safety Tested</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Complies with statutory safety parameters and standard fuse safety timings for family peace of mind.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center space-y-3 hover:shadow-md transition">
              <div className="w-12 h-12 mx-auto rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Customer Friendship</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Direct WhatsApp assistance for selecting the ideal crackers package based on your family budget.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center space-y-3 hover:shadow-md transition">
              <div className="w-12 h-12 mx-auto rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Flame className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Special Combos & Deals</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Exclusive family gift boxes and bulk discount hampers curated for Diwali and special occasions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Safety Tips Section */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-rose-50/80 border border-rose-100 rounded-3xl p-6 sm:p-10">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-white px-3 py-1 rounded-full border border-red-200">
              Celebration With Care
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Our Safety Recommendations
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Follow these simple guidelines to make every firework display safe, joyful, and memorable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-xs sm:text-sm text-slate-700">
            <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-rose-100">
              <CheckCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>Always light fireworks in open outdoor spaces away from buildings, dry leaves, and vehicles.</span>
            </div>
            <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-rose-100">
              <CheckCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>Keep a bucket of water and sand nearby for emergency safety and safely extinguishing used sparklers.</span>
            </div>
            <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-rose-100">
              <CheckCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>Children should always enjoy fireworks under strict adult guidance and supervision.</span>
            </div>
            <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-rose-100">
              <CheckCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>Use long incense sticks (agarbatti) to light crackers from a safe distance and wear cotton clothing.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Bottom CTA */}
      <section className="py-12 bg-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
            Ready to Celebrate with Madhu Sri Crackers?
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Explore our best sellers or contact us directly on WhatsApp to get the exclusive festival price list.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button 
              onClick={() => onNavigate('home')} 
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-7 py-3 rounded-full shadow-lg shadow-red-600/20 transition hover:scale-105 flex items-center gap-2"
            >
              <span>Explore Best Sellers</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onNavigate('contact')} 
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm px-7 py-3 rounded-full transition hover:scale-105"
            >
              Contact Us Directly
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

