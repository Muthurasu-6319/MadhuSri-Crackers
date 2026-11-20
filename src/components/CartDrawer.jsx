import React from 'react';
import { ShoppingBag, X, MessageCircle, ShoppingCart, Sparkles, Truck, ArrowRight, Trash2 } from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onViewCart 
}) {
  if (!isOpen) return null;

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalTotal = cart.reduce((sum, item) => sum + ((item.originalPrice || item.price) * item.quantity), 0);
  const savings = Math.max(0, originalTotal - subtotal);

  // Free delivery threshold: ₹1500
  const freeDeliveryThreshold = 1500;
  const deliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;
    
    let msg = `*New Quick Order - Madhu Sri Crackers*\n\n`;
    cart.forEach((item, idx) => {
      const itemTotal = item.price * item.quantity;
      msg += `${idx + 1}. *${item.name}* x ${item.quantity} = ₹${itemTotal}\n`;
    });
    msg += `\n*Subtotal:* ₹${subtotal}\n*Wholesale Savings:* ₹${savings}\n\nPlease confirm availability and delivery to my address. Thank you!`;
    
    const phone = '919790623441';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex justify-end animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl relative border-l border-amber-500/20 animate-slideInRight"
        style={{ animationDuration: '300ms' }}
      >
        
        {/* Luxury Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-red-700 via-[#d32f2f] to-amber-600 p-5 text-white shadow-md">
          {/* Ambient Glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-amber-300 shadow-inner">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-base tracking-tight">Festival Cart</h3>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-red-950">
                    {totalCount} {totalCount === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <p className="text-[11px] text-rose-100 flex items-center gap-1 font-medium mt-0.5">
                  <Sparkles className="w-3 h-3 text-yellow-300" /> Direct Sivakasi Wholesale Counter
                </p>
              </div>
            </div>

            <button 
              onClick={onClose} 
              aria-label="Close Cart" 
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center transition border border-white/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Progress Indicator */}
          {cart.length > 0 && (
            <div className="mt-4 pt-3 border-t border-white/15">
              <div className="flex items-center justify-between text-[11px] font-semibold text-rose-100 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-yellow-300" />
                  {subtotal >= freeDeliveryThreshold ? (
                    <span className="text-yellow-300 font-bold">🎉 Free Delivery Unlocked!</span>
                  ) : (
                    <span>Add <strong className="text-white">₹{remainingForFreeDelivery}</strong> for Free Transport</span>
                  )}
                </span>
                <span className="font-bold text-white">{deliveryProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-black/25 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-amber-300 to-yellow-400 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${deliveryProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Savings Alert Banner */}
        {cart.length > 0 && savings > 0 && (
          <div className="bg-amber-50 px-4 py-2 border-b border-amber-200/60 flex items-center justify-between text-xs text-amber-900 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="text-base">🔥</span>
              <span>Wholesale Festival Discount:</span>
            </span>
            <span className="font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
              Save ₹{savings}
            </span>
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-50 to-amber-50 border border-red-100 text-red-500 mx-auto flex items-center justify-center shadow-inner">
                <ShoppingCart className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-slate-800 text-lg">Your Cart is Empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Explore our authentic Sivakasi cracker collection and enjoy wholesale savings for this festival!
                </p>
              </div>
              <button 
                onClick={onClose} 
                className="mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white text-xs font-bold px-6 py-3 rounded-full shadow-lg shadow-red-600/20 active:scale-95 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Explore Best Sellers</span>
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const itemTotal = item.price * item.quantity;
              const itemOriginalTotal = (item.originalPrice || item.price) * item.quantity;
              const itemSavings = Math.max(0, itemOriginalTotal - itemTotal);

              return (
                <div 
                  key={item.id} 
                  className="flex items-center gap-3.5 p-3.5 bg-slate-50/80 hover:bg-slate-50 rounded-2xl border border-slate-200/80 shadow-xs hover:border-red-200 transition group"
                >
                  {/* Item Image */}
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-200/80 p-1.5 shrink-0 flex items-center justify-center overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-contain group-hover:scale-105 transition duration-300" 
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                        {item.name}
                      </h4>
                      <button 
                        onClick={() => onRemoveItem(item.id)} 
                        title="Remove item"
                        className="text-slate-400 hover:text-red-600 p-1 -mr-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-xs font-extrabold text-red-600">₹{item.price}</span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-[10px] text-slate-400 line-through">₹{item.originalPrice}</span>
                      )}
                      {itemSavings > 0 && (
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded">
                          Save ₹{itemSavings}
                        </span>
                      )}
                    </div>

                    {/* Quantity Stepper & Subtotal */}
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="inline-flex items-center border border-slate-200 bg-white rounded-lg shadow-2xs">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)} 
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold text-xs rounded-l-lg transition active:scale-95"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-slate-900 px-2.5 min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)} 
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold text-xs rounded-r-lg transition active:scale-95"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <div className="font-black text-slate-900 text-xs">
                        ₹{itemTotal}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary & Checkout CTAs */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-3.5 shadow-lg">
            {/* Bill Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Retail Total</span>
                <span className="line-through text-slate-400">₹{originalTotal}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Festival Direct Discount</span>
                  <span className="font-bold">-₹{savings}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Transport</span>
                <span className="font-semibold text-slate-800">
                  {subtotal >= freeDeliveryThreshold ? (
                    <span className="text-emerald-600 font-bold uppercase tracking-wider text-[11px]">FREE</span>
                  ) : (
                    '₹99'
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-100">
                <span>Payable Amount</span>
                <span className="text-red-600">₹{subtotal + (subtotal >= freeDeliveryThreshold ? 0 : 99)}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-1">
              <button 
                onClick={() => {
                  onClose();
                  if (onViewCart) onViewCart();
                }} 
                className="w-full bg-gradient-to-r from-red-600 via-[#d32f2f] to-amber-600 hover:from-red-700 hover:to-amber-700 active:scale-[0.99] text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 text-xs sm:text-sm tracking-wide transition"
              >
                <span>Proceed to Order & Invoice</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
              
              <button 
                onClick={handleWhatsAppOrder}
                className="w-full bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white font-bold py-2.5 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 text-xs transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant WhatsApp Order</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
