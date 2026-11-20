import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { allProducts } from '../data/products';

export default function SearchModal({ isOpen, onClose, onAddToCart, onNavigate, products = allProducts }) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const items = products && products.length > 0 ? products : allProducts;
  const filtered = query.trim()
    ? items.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        (p.categoryName && p.categoryName.toLowerCase().includes(query.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4 animate-fadeIn">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for crackers, sparklers, sky shots..." 
            className="flex-1 text-sm text-slate-800 focus:outline-none placeholder:text-slate-400"
          />
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="p-4 max-h-80 overflow-y-auto space-y-2">
          {!query.trim() ? (
            <p className="text-sm text-slate-400 text-center py-6">
              Type to search for crackers, sparklers, sky shots, flower pots...
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">
              No crackers found matching "<b>{query}</b>". Try "Sparklers" or "Pots".
            </p>
          ) : (
            filtered.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-12 h-12 object-contain rounded-lg border border-slate-200 bg-white p-1" 
                  />
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">{item.name}</h5>
                    <div className="text-xs text-red-600 font-semibold">
                      ₹{item.price} <span className="text-slate-400 line-through">₹{item.originalPrice}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    onAddToCart(item);
                    onClose();
                  }} 
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full transition"
                >
                  Add to Cart
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

