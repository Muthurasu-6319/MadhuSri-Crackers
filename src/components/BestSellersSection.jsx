import React from 'react';
import { ShoppingCart, Heart, Star, Sparkles, ShieldCheck, Flame, ArrowRight } from 'lucide-react';
import { bestSellers } from '../data/products';

export default function BestSellersSection({ onAddToCart, wishlist = new Set(), onToggleWishlist, products, onNavigate }) {
  const items = React.useMemo(() => {
    if (products && products.length > 0) {
      const best = products.filter(p => p.isBestSeller);
      return best.length > 0 ? best.slice(0, 4) : products.slice(0, 4);
    }
    return bestSellers;
  }, [products]);

  return (
    <section id="best-sellers" className="py-16 sm:py-20 bg-white relative overflow-hidden">
      
      {/* Background radial soft gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-rose-50/40 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200/80 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2.5">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Highest Demand This Festival</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Featured Best Sellers
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Top-rated sky shots, grand gift boxes, and family favorite sparkle fireworks.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate && onNavigate('shop')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 px-4 py-2.5 rounded-full transition self-start md:self-auto group"
          >
            <span>View Full 2026 Catalog</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

        {/* 4 Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((product) => {
            const isWishlisted = wishlist.has(product.id);
            const savings = Math.max(0, (Number(product.originalPrice) || Number(product.price)) - Number(product.price));

            return (
              <div 
                key={product.id} 
                className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-sm flex flex-col justify-between relative group hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-600/10 hover:border-red-200 transition-all duration-300"
              >
                {/* Discount Ribbon Badge */}
                {product.discount && (
                  <div className="absolute top-3.5 left-3.5 z-10 bg-gradient-to-r from-red-600 to-amber-500 text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-current" />
                    <span>{product.discount}</span>
                  </div>
                )}

                {/* Wishlist Heart Toggle */}
                <button 
                  onClick={() => onToggleWishlist(product.id)} 
                  aria-label="Toggle Wishlist"
                  className={`absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90 ${
                    isWishlisted ? 'text-red-600 bg-red-50' : 'text-slate-400 hover:text-red-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-600 text-red-600' : ''}`} />
                </button>

                {/* Product Image Pedestal */}
                <div className="overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/60 mb-4 h-48 flex items-center justify-center relative p-3">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-md" 
                    loading="lazy"
                  />
                  
                  {/* Subtle in-stock badge */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-700 shadow-sm border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>In Stock</span>
                  </div>
                </div>

                {/* Product Meta Info */}
                <div className="space-y-2 mb-4">
                  {/* Category Pill & Rating */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {product.categoryName || 'Crackers'}
                    </span>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 text-amber-700 font-bold text-[11px]">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{product.rating || 4.8}</span>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-red-600 transition">
                    {product.name}
                  </h3>

                  {/* Pricing Display */}
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-xl font-black text-red-600">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-xs font-semibold text-slate-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                    {savings > 0 && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 ml-auto">
                        Save ₹{savings}
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart CTA */}
                <button 
                  onClick={() => onAddToCart(product)} 
                  className="btn-shimmer w-full py-2.5 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 active:scale-98 text-white font-extrabold text-xs rounded-xl shadow-md shadow-red-600/25 flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02]"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Festival Cart</span>
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
