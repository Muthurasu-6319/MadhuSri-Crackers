import React from 'react';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Sparkles, 
  ChevronRight, 
  ArrowRight, 
  Star,
  CheckCircle2,
  Flame,
  ShoppingBag
} from 'lucide-react';
import { allProducts } from '../data/products';

export default function WishlistPage({ 
  wishlist = new Set(), 
  onToggleWishlist, 
  onAddToCart, 
  onNavigate,
  onShowToast 
}) {
  const wishlistedProducts = allProducts.filter(product => wishlist.has(product.id));

  const handleAddAllToCart = () => {
    if (wishlistedProducts.length === 0) return;
    wishlistedProducts.forEach(product => {
      onAddToCart(product);
    });
    if (onShowToast) onShowToast(`Added all ${wishlistedProducts.length} items to your cart!`, 'cart');
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* 1. Page Header with Festive Accents */}
      <div className="relative bg-gradient-to-r from-white via-rose-50/70 to-amber-50/60 text-slate-900 py-10 sm:py-14 overflow-hidden shadow-2xs border-b border-rose-100/80">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-red-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 font-medium">
            <button 
              onClick={() => onNavigate && onNavigate('home')} 
              className="hover:text-red-600 transition"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <button 
              onClick={() => onNavigate && onNavigate('shop')} 
              className="hover:text-red-600 transition"
            >
              Shop
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-red-600 font-bold">My Festival Wishlist</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold mb-2 shadow-2xs">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Saved For Festival Celebration</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                <span>Festival Wishlist</span>
                <span className="text-sm sm:text-base font-bold bg-amber-100 text-amber-900 border border-amber-200 px-3 py-0.5 rounded-full shadow-2xs">
                  {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'item' : 'items'}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                Keep track of your favorite aerial fireworks, sparklers, and gift hampers to order before Diwali stock runs out.
              </p>
            </div>

            {wishlistedProducts.length > 0 && (
              <button
                onClick={handleAddAllToCart}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-red-600/25 transition active:scale-95 self-start sm:self-auto"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Move All ({wishlistedProducts.length}) to Cart</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {wishlistedProducts.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-sm my-12 animate-fadeIn">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-rose-50 to-red-50 text-red-500 mx-auto flex items-center justify-center mb-6 shadow-inner border border-red-100">
              <Heart className="w-12 h-12 stroke-[1.8]" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              Your Wishlist is Empty
            </h2>
            <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
              Explore our wide variety of sparkling flower pots, rockets, and mega sky shots, and tap the heart icon to save your favorites.
            </p>
            <button
              onClick={() => onNavigate && onNavigate('shop')}
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-red-600/25 active:scale-95 transition text-sm"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Explore All Crackers</span>
            </button>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistedProducts.map((product) => {
              const savings = product.originalPrice ? product.originalPrice - product.price : 0;
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group overflow-hidden relative"
                >
                  {/* Image area */}
                  <div className="relative p-5 bg-gradient-to-b from-slate-50 to-white flex items-center justify-center h-52 border-b border-slate-100">
                    
                    {/* Discount badge */}
                    {product.discount && (
                      <span className="absolute top-3.5 left-3.5 bg-gradient-to-r from-red-600 to-amber-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md z-10 flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-current text-yellow-300" />
                        <span>{product.discount}</span>
                      </span>
                    )}

                    {/* Remove button */}
                    <button
                      onClick={() => onToggleWishlist(product.id)}
                      className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow border border-slate-200 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 transition z-10 active:scale-90"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-40 max-w-[85%] object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded">
                          {product.categoryName || 'Sivakasi'}
                        </span>
                        
                        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-50 px-1.5 py-0.5 rounded">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{product.rating || '4.8'}</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm mt-1 line-clamp-2 group-hover:text-red-600 transition">
                        {product.name}
                      </h3>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="flex items-baseline justify-between mb-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-red-600">
                            ₹{product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-slate-400 line-through">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                        {savings > 0 && (
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            Save ₹{savings}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => onAddToCart(product)}
                        className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 active:scale-[0.98] text-white font-extrabold py-2.5 px-3 rounded-xl shadow-md shadow-red-600/20 flex items-center justify-center gap-2 text-xs transition"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
