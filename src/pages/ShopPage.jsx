import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Star, 
  ShoppingCart, 
  Heart, 
  Eye, 
  X, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Flame, 
  Info,
  ChevronRight,
  RotateCcw,
  MessageCircle,
  Package
} from 'lucide-react';
import { allProducts as defaultProducts, categories as defaultCategories } from '../data/products';

export default function ShopPage({ 
  onAddToCart, 
  wishlist = new Set(), 
  onToggleWishlist,
  initialCategory = 'all',
  onNavigate,
  categories = defaultCategories,
  products = defaultProducts
}) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all'); // 'all' | 'under-250' | '250-500' | 'above-500'
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-low' | 'price-high' | 'rating'
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewQty, setQuickViewQty] = useState(1);

  // Sync selected category if navigated with a specific category
  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const activeCategories = (categories && categories.length > 0) ? categories : defaultCategories;

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const list = (products && products.length > 0) ? products : defaultProducts;
    return list
      .filter(product => {
        // Category filter
        if (selectedCategory !== 'all' && product.category !== selectedCategory) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchesName = product.name?.toLowerCase().includes(query);
          const matchesCat = product.categoryName?.toLowerCase().includes(query);
          const matchesDesc = product.description?.toLowerCase().includes(query);
          if (!matchesName && !matchesCat && !matchesDesc) return false;
        }

        // Price range filter
        if (priceFilter === 'under-250' && product.price >= 250) return false;
        if (priceFilter === '250-500' && (product.price < 250 || product.price > 500)) return false;
        if (priceFilter === 'above-500' && product.price <= 500) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, priceFilter, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPriceFilter('all');
    setSortBy('featured');
  };

  const hasActiveFilters = selectedCategory !== 'all' || searchQuery !== '' || priceFilter !== 'all' || sortBy !== 'featured';

  const openQuickView = (product) => {
    setQuickViewProduct(product);
    setQuickViewQty(1);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  const handleQuickViewAdd = () => {
    if (!quickViewProduct) return;
    for (let i = 0; i < quickViewQty; i++) {
      onAddToCart(quickViewProduct);
    }
    closeQuickView();
  };

  return (
    <div className="bg-[#fafbfc] min-h-screen pb-20">
      
      {/* 1. Header Hero Banner */}
      <section className="bg-gradient-to-r from-white via-rose-50/70 to-amber-50/60 text-slate-900 py-12 sm:py-16 shadow-xs border-b border-rose-100/80 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-red-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 bg-red-50 border border-red-200 px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase mb-3 text-red-700 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
              2026 Sivakasi Wholesale Catalog
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3 text-slate-900">
              Madhu Sri Fireworks Counter
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Genuine Sivakasi fireworks, sky shots, multi-color sparklers, deluxe flower pots, and family gift boxes direct from factory at wholesale counter pricing.
            </p>

            {/* Trust Strip */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Genuine Green Crackers
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-2xs">
                <Truck className="w-4 h-4 text-amber-600" /> Safe All-Tamil Nadu Hub Dispatch
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-2xs">
                <Flame className="w-4 h-4 text-red-600" /> Sivakasi Factory Direct Rates
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <button 
            onClick={() => onNavigate && onNavigate('home')} 
            className="hover:text-red-600 transition"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-bold">Catalog</span>
          {selectedCategory !== 'all' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-red-600 font-bold capitalize">
                {activeCategories.find(c => c.id === selectedCategory)?.name || selectedCategory}
              </span>
            </>
          )}
        </div>

        {/* 3. Filter & Search Controls Panel */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-5 sm:p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search crackers (e.g. Sky Shot, Sparkler, Deluxe Flower Pot, Gift Box)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Price Filter & Sort Dropdown */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Price Range Filter */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-bold hidden sm:inline">Price:</span>
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                >
                  <option value="all">All Prices</option>
                  <option value="under-250">Under ₹250</option>
                  <option value="250-500">₹250 - ₹500</option>
                  <option value="above-500">Above ₹500</option>
                </select>
              </div>

              {/* Sorting Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                >
                  <option value="featured">Featured / Best Sellers</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* Reset Filters Button */}
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-bold px-3 py-2 hover:bg-red-50 rounded-xl transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Pills Navigation */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {activeCategories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-600/25 scale-[1.02]'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Products Result Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs sm:text-sm text-slate-600 font-medium">
            Showing <span className="font-extrabold text-slate-900">{filteredProducts.length}</span> crackers
            {selectedCategory !== 'all' && (
              <span> in <span className="text-red-600 font-bold">{activeCategories.find(c => c.id === selectedCategory)?.name}</span></span>
            )}
          </div>
          <div className="text-xs text-slate-500 hidden sm:flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Wholesale Factory Rates Applied</span>
          </div>
        </div>

        {/* 5. Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12 shadow-sm">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">No crackers found</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              We couldn't find any crackers matching your filters. Try selecting another category or resetting filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-2.5 rounded-full transition shadow-md"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isWishlisted = wishlist.has(product.id);
              const savings = Math.max(0, (Number(product.originalPrice) || Number(product.price)) - Number(product.price));

              return (
                <div 
                  key={product.id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-2xl hover:shadow-red-600/10 hover:border-red-200 transition-all duration-300 flex flex-col group overflow-hidden relative"
                >
                  {/* Card Header & Badges */}
                  <div className="relative p-3 bg-gradient-to-b from-slate-50 to-slate-100/60 flex items-center justify-center h-52 overflow-hidden">
                    
                    {/* Discount Badge */}
                    {product.discount && (
                      <span className="absolute top-3.5 left-3.5 bg-gradient-to-r from-red-600 to-amber-500 text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-md z-10 flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-current" />
                        <span>{product.discount}</span>
                      </span>
                    )}

                    {/* Best Seller Pill */}
                    {product.isBestSeller && (
                      <span className="absolute top-3.5 right-12 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm z-10 uppercase tracking-wider">
                        Bestseller
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={() => onToggleWishlist(product.id)}
                      aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      className={`absolute top-3.5 right-3.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
                        isWishlisted 
                          ? 'bg-red-50 text-red-600 border border-red-200' 
                          : 'bg-white/90 text-slate-400 hover:text-red-500 hover:bg-white shadow-sm'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-600' : ''}`} />
                    </button>

                    {/* Product Image */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-h-40 max-w-[85%] object-contain drop-shadow group-hover:scale-108 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Live in-stock beacon */}
                    <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-700 shadow-sm border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>In Stock</span>
                    </div>

                    {/* Quick View Button on Hover */}
                    <button
                      onClick={() => openQuickView(product)}
                      className="absolute bottom-2.5 right-3 bg-white/95 backdrop-blur-sm text-slate-700 hover:text-red-600 text-[11px] font-bold px-3 py-1 rounded-full shadow border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Quick View
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Category Label */}
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {product.categoryName || 'Crackers'}
                      </span>

                      {/* Product Title */}
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mt-1 line-clamp-1 group-hover:text-red-600 transition">
                        {product.name}
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {product.description || 'Authentic Sivakasi cracker box made with approved green pyro technology.'}
                      </p>

                      {/* Star Rating & Review Count */}
                      <div className="flex items-center gap-1.5 mt-2.5">
                        <div className="flex items-center text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">{product.rating || 4.8}</span>
                        <span className="text-[11px] text-slate-400">({product.reviews || '100+'})</span>
                      </div>
                    </div>

                    {/* Price and Add to Cart Section */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100">
                      <div className="flex items-baseline justify-between mb-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-red-600">
                            ₹{product.price}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-xs font-semibold text-slate-400 line-through">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                        {savings > 0 && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                            Save ₹{savings}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => onAddToCart(product)}
                        className="btn-shimmer w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 active:scale-98 text-white font-extrabold py-2.5 px-3 rounded-xl shadow-md shadow-red-600/20 flex items-center justify-center gap-2 text-xs transition duration-200"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Festival Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 animate-fadeIn relative">
            {/* Close Button */}
            <button
              onClick={closeQuickView}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image Area */}
              <div className="bg-slate-50 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 relative">
                {quickViewProduct.discount && (
                  <span className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-amber-500 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                    {quickViewProduct.discount}
                  </span>
                )}
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="max-h-56 object-contain drop-shadow-md"
                />
              </div>

              {/* Info Area */}
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {quickViewProduct.categoryName}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-1">
                    {quickViewProduct.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-700">{quickViewProduct.rating || 4.8}</span>
                    <span className="text-xs text-slate-400">({quickViewProduct.reviews || '100+'} reviews)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2.5 mt-4">
                    <span className="text-2xl font-black text-red-600">
                      ₹{quickViewProduct.price}
                    </span>
                    {quickViewProduct.originalPrice && (
                      <span className="text-sm text-slate-400 line-through">
                        ₹{quickViewProduct.originalPrice}
                      </span>
                    )}
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Save ₹{quickViewProduct.originalPrice - quickViewProduct.price}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 mt-4 leading-relaxed">
                    {quickViewProduct.description}
                  </p>

                  {/* Safe Product Specs */}
                  <div className="mt-4 p-3 bg-slate-50 rounded-2xl space-y-1.5 text-[11px] text-slate-600 border border-slate-100">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Certified Green Cracker formulation</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Direct Sivakasi manufacturing quality</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Safe handling instructions included in pack</span>
                    </div>
                  </div>
                </div>

                {/* Quantity and Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-700">Quantity:</span>
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                      <button
                        onClick={() => setQuickViewQty(prev => Math.max(1, prev - 1))}
                        className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 rounded-l-xl transition text-xs"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-xs font-bold text-slate-800">
                        {quickViewQty}
                      </span>
                      <button
                        onClick={() => setQuickViewQty(prev => prev + 1)}
                        className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 rounded-r-xl transition text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleQuickViewAdd}
                      className="btn-shimmer flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add ({quickViewQty}) to Cart</span>
                    </button>
                    <button
                      onClick={() => onToggleWishlist(quickViewProduct.id)}
                      className={`p-2.5 rounded-xl border transition ${
                        wishlist.has(quickViewProduct.id)
                          ? 'border-red-200 bg-red-50 text-red-600'
                          : 'border-slate-200 bg-white text-slate-500 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${wishlist.has(quickViewProduct.id) ? 'fill-red-600' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
