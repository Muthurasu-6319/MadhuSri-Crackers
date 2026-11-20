import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, ChevronDown, Menu, X, Sparkles, MessageCircle, Layers } from 'lucide-react';

export default function Navbar({ 
  cartCount = 0, 
  wishlistCount = 0, 
  onOpenCart, 
  onOpenSearch, 
  currentPage = 'home', 
  onNavigate,
  categories = [] 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page, param) => {
    if (onNavigate) {
      onNavigate(page, param);
    }
    setMobileMenuOpen(false);
    if (param && typeof param === 'string' && param.startsWith('#')) {
      setTimeout(() => {
        const el = document.querySelector(param);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-rose-100/60 shadow-sm shadow-slate-900/5 transition-all w-full">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-1.5 sm:gap-4">
        
        {/* Brand Logo */}
        <a 
          href="#home" 
          onClick={(e) => { e.preventDefault(); handleNav('home'); }} 
          className="flex items-center gap-1.5 sm:gap-3 group shrink min-w-0"
        >
          <div className="relative shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-amber-500 rounded-full blur-sm opacity-30 group-hover:opacity-60 transition duration-300"></div>
            <img 
              src="/madhusri.png" 
              alt="Madhu Sri Crackers" 
              className="relative h-10 sm:h-14 w-auto aspect-square object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105 shrink-0" 
            />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-sm sm:text-xl font-black text-[#c8102e] leading-none tracking-tight truncate">
                Madhu Sri
              </span>
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 shrink-0" />
            </div>
            <span className="text-[9px] sm:text-xs font-black text-slate-800 tracking-wider sm:tracking-widest uppercase mt-0.5 truncate">
              Crackers Sivakasi
            </span>
          </div>
        </a>

        {/* Desktop Navigation Menu */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 text-xs lg:text-sm font-semibold text-slate-700">
          <button 
            type="button"
            onClick={() => handleNav('home')} 
            className={`px-4 py-2 rounded-full transition-all duration-200 ${
              currentPage === 'home' 
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-600/25 font-bold' 
                : 'text-slate-700 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            Home
          </button>

          {/* Shop All Dropdown */}
          <div className="relative group px-1 py-2">
            <button 
              onClick={() => handleNav('shop')}
              className={`flex items-center gap-1 px-3.5 py-2 rounded-full transition-all duration-200 ${
                currentPage === 'shop' 
                  ? 'bg-red-50 text-red-600 font-bold border border-red-200' 
                  : 'text-slate-700 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              <span>Shop All</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 transition duration-200" />
            </button>
            <div className="absolute left-0 top-full hidden group-hover:block w-56 bg-white shadow-2xl rounded-2xl border border-slate-100 py-2.5 z-50 animate-fadeIn">
              <button 
                type="button"
                onClick={() => handleNav('shop', 'all')} 
                className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-slate-800 hover:text-red-600 text-xs font-bold flex items-center justify-between"
              >
                <span>All Crackers (Catalog)</span>
                <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">2026</span>
              </button>
              <div className="my-1 border-t border-slate-100"></div>
              <button 
                type="button"
                onClick={() => handleNav('shop', 'aerial-skyshots')} 
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-slate-700 hover:text-red-600 text-xs font-medium"
              >
                🚀 Sky Shots & Aerial Fireworks
              </button>
              <button 
                type="button"
                onClick={() => handleNav('shop', 'sparklers')} 
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-slate-700 hover:text-red-600 text-xs font-medium"
              >
                ✨ Sparklers & Ground Chakkars
              </button>
              <button 
                type="button"
                onClick={() => handleNav('shop', 'gift-boxes')} 
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-slate-700 hover:text-red-600 text-xs font-medium"
              >
                🎁 Family & Corporate Gift Boxes
              </button>
            </div>
          </div>

          {/* Categories Dropdown */}
          <div className="relative group px-1 py-2">
            <button className="flex items-center gap-1 px-3.5 py-2 rounded-full text-slate-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200">
              <Layers className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600" />
              <span>Categories</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 transition" />
            </button>
            <div className="absolute left-0 top-full hidden group-hover:block w-60 bg-white shadow-2xl rounded-2xl border border-slate-100 py-2.5 z-50 max-h-80 overflow-y-auto animate-fadeIn">
              <div className="px-4 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Select Category
              </div>
              {(categories || []).filter(c => c.id !== 'all').map((cat) => (
                <button 
                  key={cat.id} 
                  type="button"
                  onClick={() => handleNav('shop', cat.id)} 
                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-slate-700 hover:text-red-600 text-xs font-medium transition"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Enquiry Page Link */}
          <button 
            type="button"
            onClick={() => handleNav('enquiry')} 
            className={`px-4 py-2 rounded-full transition-all duration-200 ${
              currentPage === 'enquiry' 
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-600/25 font-bold' 
                : 'text-slate-700 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            Bulk Enquiry
          </button>

          <button 
            type="button"
            onClick={() => handleNav('about')} 
            className={`px-4 py-2 rounded-full transition-all duration-200 ${
              currentPage === 'about' 
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-600/25 font-bold' 
                : 'text-slate-700 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            About Us
          </button>

          <button 
            type="button"
            onClick={() => handleNav('contact')} 
            className={`px-4 py-2 rounded-full transition-all duration-200 ${
              currentPage === 'contact' 
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-600/25 font-bold' 
                : 'text-slate-700 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          
          {/* Interactive Search Pill (Desktop) */}
          <button
            onClick={onOpenSearch}
            className="hidden lg:flex items-center gap-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 text-xs px-3.5 py-2 rounded-full border border-slate-200/70 transition"
            title="Search crackers"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">Search crackers...</span>
            <kbd className="text-[10px] bg-white border border-slate-200 text-slate-400 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
          </button>

          {/* Search Icon (Mobile / Tablet) */}
          <button 
            onClick={onOpenSearch} 
            aria-label="Search Crackers" 
            className="lg:hidden w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-slate-700 hover:text-red-600 hover:bg-red-50 transition"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Wishlist */}
          <button 
            onClick={() => handleNav('wishlist')}
            aria-label="Wishlist" 
            className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition ${
              currentPage === 'wishlist' 
                ? 'bg-red-50 text-red-600 border border-red-200' 
                : 'text-slate-700 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-600 text-white rounded-full text-[9px] sm:text-[10px] font-black flex items-center justify-center shadow-md animate-pulse">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button 
            onClick={onOpenCart} 
            aria-label="Shopping Cart" 
            className="relative inline-flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-full shadow-md shadow-red-600/20 transition-all duration-200 active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
            <span className="hidden sm:inline">Cart</span>
            <span className="bg-white text-red-700 text-[10px] sm:text-xs font-black px-1.5 sm:px-2 py-0.2 sm:py-0.5 rounded-full shadow-xs">
              {cartCount}
            </span>
          </button>

          {/* Mobile Hamburger Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            aria-label="Toggle Navigation" 
            className="md:hidden w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 transition active:scale-95 shrink-0"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-5 shadow-2xl animate-fadeIn max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col gap-1.5 font-semibold text-slate-800 text-sm">
            <button 
              type="button"
              onClick={() => handleNav('home')} 
              className={`w-full text-left px-4 py-2.5 rounded-xl transition ${
                currentPage === 'home' ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/20' : 'hover:bg-red-50'
              }`}
            >
              🏠 Home
            </button>
            <button 
              type="button"
              onClick={() => handleNav('shop')} 
              className={`w-full text-left px-4 py-2.5 rounded-xl transition ${
                currentPage === 'shop' ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/20' : 'hover:bg-red-50'
              }`}
            >
              🎆 Shop All Crackers (Catalog)
            </button>
            <button 
              type="button"
              onClick={() => handleNav('enquiry')} 
              className={`w-full text-left px-4 py-2.5 rounded-xl transition ${
                currentPage === 'enquiry' ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/20' : 'hover:bg-red-50'
              }`}
            >
              📋 Bulk & Festival Event Enquiry
            </button>
            <button 
              type="button"
              onClick={() => handleNav('wishlist')} 
              className={`w-full text-left px-4 py-2.5 rounded-xl transition flex items-center justify-between ${
                currentPage === 'wishlist' ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/20' : 'hover:bg-red-50'
              }`}
            >
              <span>❤️ Festival Wishlist</span>
              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-700 font-bold">{wishlistCount}</span>
            </button>
            <button 
              type="button"
              onClick={() => handleNav('cart')} 
              className={`w-full text-left px-4 py-2.5 rounded-xl transition flex items-center justify-between ${
                currentPage === 'cart' ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/20' : 'hover:bg-red-50'
              }`}
            >
              <span>🛒 Shopping Cart</span>
              <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">{cartCount} items</span>
            </button>
            <button 
              type="button"
              onClick={() => handleNav('about')} 
              className={`w-full text-left px-4 py-2.5 rounded-xl transition ${
                currentPage === 'about' ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/20' : 'hover:bg-red-50'
              }`}
            >
              🏢 About Madhu Sri Crackers
            </button>
            <button 
              type="button"
              onClick={() => handleNav('contact')} 
              className={`w-full text-left px-4 py-2.5 rounded-xl transition ${
                currentPage === 'contact' ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/20' : 'hover:bg-red-50'
              }`}
            >
              📞 Contact & Dispatch Location
            </button>

            {/* Quick WhatsApp Support Pill in Mobile Menu */}
            <div className="pt-3 mt-2 border-t border-slate-100">
              <a
                href="https://wa.me/919790623441?text=Vanakkam%20Madhu%20Sri%20Crackers%2C%20I%20want%20to%20order%20crackers!"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Direct WhatsApp Inquiry: +91 9790623441</span>
              </a>
            </div>

            {/* Categories Direct Access */}
            {categories && categories.filter(c => c.id !== 'all').length > 0 && (
              <div className="pt-3 mt-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">Store Categories</span>
                <div className="grid grid-cols-2 gap-1.5 mt-2">
                  {categories.filter(c => c.id !== 'all').map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleNav('shop', cat.id)}
                      className="text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-lg truncate bg-slate-50 border border-slate-100"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
