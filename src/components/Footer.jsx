import React from 'react';
import { Phone, Mail, MapPin, Sparkles, ShieldCheck, Truck, MessageCircle, Heart, ChevronRight } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const handleNav = (page, anchor) => {
    if (onNavigate) {
      onNavigate(page);
    }
    if (anchor) {
      setTimeout(() => {
        const el = document.querySelector(anchor);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer id="footer" className="relative bg-white text-slate-700 border-t border-slate-200 overflow-hidden">
      
      {/* Top Festival Greeting Ribbon */}
      <div className="bg-gradient-to-r from-red-600 via-[#d32f2f] to-amber-600 py-3 px-4 text-white text-center relative z-10 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-6 text-xs font-extrabold tracking-wide">
          <span className="flex items-center gap-1.5 text-yellow-300">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>ஸ்ரீ மதுரை வீரன் துணை</span>
          </span>
          <span className="hidden sm:inline text-rose-200">•</span>
          <span>நேரடி சிவகாசி பட்டாசுகள் மொத்த விலையில்</span>
          <span className="hidden sm:inline text-rose-200">•</span>
          <span className="text-yellow-200">2026 Festival Booking Open</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-100">
          
          {/* Brand & Sivakasi Trust (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-white p-1.5 shadow-md border border-rose-200 flex items-center justify-center">
                <img 
                  src="/madhusri.png" 
                  alt="Madhu Sri Crackers" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">Madhu Sri</span>
                  <span className="text-xs font-black bg-red-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    Crackers
                  </span>
                </div>
                <span className="text-xs font-bold text-amber-700 tracking-wide mt-0.5">
                  Direct Sivakasi Wholesale Counter • Veerasigamani
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
              Bringing joy, happiness, and sparkling festive memories to families across Tamil Nadu. Meticulously tested fireworks, direct wholesale savings, and safe parcel dispatch.
            </p>

            {/* Trust Chips */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Genuine Sivakasi</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                <Truck className="w-4 h-4 text-amber-600" />
                <span>All-TN Parcel Transport</span>
              </div>
            </div>
          </div>

          {/* Quick Links (2 Cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-extrabold text-xs uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-1.5">
              <span>Explore Store</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-semibold">
              <li>
                <button type="button" onClick={() => handleNav('home')} className="hover:text-red-600 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-red-500" />
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('shop')} className="hover:text-red-600 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-red-500" />
                  <span>Shop All Crackers</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('enquiry')} className="hover:text-red-600 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-red-500" />
                  <span>Wholesale & Events</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('wishlist')} className="hover:text-red-600 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-red-500" />
                  <span>Festival Wishlist</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('cart')} className="hover:text-red-600 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-red-500" />
                  <span>Cart & Checkout</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('about')} className="hover:text-red-600 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-red-500" />
                  <span>Our Heritage & Safety</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('contact')} className="hover:text-red-600 transition flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-red-500" />
                  <span>Contact Sales Counter</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Cracker Categories (2 Cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-extrabold text-xs uppercase tracking-widest text-slate-900 mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 font-semibold">
              <li>
                <button type="button" onClick={() => handleNav('shop')} className="hover:text-red-600 transition">
                  Sparklers & Wire
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('shop')} className="hover:text-red-600 transition">
                  Ground Chakkars
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('shop')} className="hover:text-red-600 transition">
                  Flower Pots & Koti
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('shop')} className="hover:text-red-600 transition">
                  Aerial Sky Shots
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('shop')} className="hover:text-red-600 transition">
                  Sound Crackers
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('shop')} className="hover:text-red-600 transition">
                  Family Gift Boxes
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Counter Hours (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs uppercase tracking-widest text-slate-900">
                Direct Counter
              </h4>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Counter Open</span>
              </span>
            </div>

            <ul className="space-y-3 text-xs text-slate-600 font-medium">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  8/389/1, Amman Complex,<br />
                  Chenthamaram Road, Veerasigamani,<br />
                  Tenkasi, Tamil Nadu - 627862
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                <a href="tel:+919790623441" className="text-slate-900 font-black hover:text-red-600 transition text-sm">
                  +91 9790623441
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                <a href="mailto:info@madhusricrackers.com" className="hover:text-red-600 transition">
                  info@madhusricrackers.com
                </a>
              </li>
            </ul>

            {/* Quick Action WhatsApp Button */}
            <div className="pt-1">
              <a 
                href="https://wa.me/919790623441?text=Hi%20Madhu%20Sri%20Crackers%2C%20I%20would%20like%20to%20place%20an%20order!"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white font-extrabold text-xs py-2.5 px-3 rounded-xl transition shadow-md shadow-green-600/15"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat with Sales Desk</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Admin Shortcut */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Madhu Sri Crackers. All Rights Reserved. Manufactured in Sivakasi.
          </div>

          <div className="flex items-center gap-4 font-medium">
            <button 
              type="button" 
              onClick={() => handleNav('about')} 
              className="hover:text-red-600 transition"
            >
              Safety Guidelines
            </button>
            <span>•</span>
            <button 
              type="button" 
              onClick={() => handleNav('contact')} 
              className="hover:text-red-600 transition"
            >
              Transport Booking
            </button>
            <span>•</span>
            <button 
              type="button" 
              onClick={() => handleNav('admin')} 
              className="hover:text-red-600 transition text-[11px] font-bold text-slate-400"
            >
              Admin Portal
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
