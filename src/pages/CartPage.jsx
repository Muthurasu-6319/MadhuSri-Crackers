import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowLeft, 
  Tag, 
  ShieldCheck, 
  Truck, 
  MessageCircle, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  PhoneCall, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  FileText, 
  Download, 
  AlertCircle,
  Flame,
  Gift,
  HelpCircle
} from 'lucide-react';
import { generateInvoicePDF } from '../utils/generateInvoice';
import InvoiceModal from '../components/InvoiceModal';
import { saveOrderApi } from '../utils/api';

export default function CartPage({ 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart,
  onNavigate, 
  onShowToast 
}) {
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Required Customer Details for Order & PDF Invoice
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Completed Order Modal State
  const [completedOrder, setCompletedOrder] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalTotal = cart.reduce((sum, item) => sum + ((item.originalPrice || item.price) * item.quantity), 0);
  const festivalSavings = Math.max(0, originalTotal - subtotal);
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Delivery calculation: Free delivery on orders above 1500
  const freeDeliveryThreshold = 1500;
  const deliveryCharge = subtotal >= freeDeliveryThreshold || subtotal === 0 ? 0 : 99;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const deliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const totalPayable = Math.max(0, subtotal - couponDiscount + deliveryCharge);

  const handleApplyCoupon = (e, explicitCode) => {
    if (e && e.preventDefault) e.preventDefault();
    const code = (explicitCode || couponCode).trim().toUpperCase();
    if (!code) return;

    if (code === 'DIWALI2026' || code === 'FESTIVAL5') {
      const discount = Math.round(subtotal * 0.05);
      setCouponCode(code);
      setCouponDiscount(discount);
      setCouponApplied(true);
      if (onShowToast) onShowToast(`Coupon ${code} applied! 5% extra festival savings!`, 'success');
    } else {
      if (onShowToast) onShowToast('Invalid coupon code. Try DIWALI2026', 'info');
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponApplied(false);
    setCouponDiscount(0);
    if (onShowToast) onShowToast('Coupon removed', 'info');
  };

  const handleWhatsAppOrder = async () => {
    if (cart.length === 0) return;

    // Validate Name, WhatsApp Number, and Delivery Address
    const errors = {};
    if (!customerName.trim()) errors.name = 'Please enter your Full Name';
    if (!customerPhone.trim()) errors.phone = 'Please enter your WhatsApp Number';
    if (!deliveryAddress.trim()) errors.address = 'Please enter your Full Delivery Address';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      if (onShowToast) onShowToast('Please fill Name, WhatsApp No, and Address to order', 'error');
      return;
    }

    setFormErrors({});

    // 1. Generate Order & Invoice Details
    const orderId = `MSC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const orderData = {
      orderId,
      date: dateStr,
      customer: {
        name: customerName.trim(),
        phone: customerPhone.trim(),
        address: deliveryAddress.trim()
      },
      items: [...cart],
      pricing: {
        originalTotal,
        subtotal,
        savings: festivalSavings + couponDiscount,
        deliveryCharge,
        totalAmount: totalPayable
      }
    };

    // 2. Auto-Generate & Download PDF Invoice
    try {
      generateInvoicePDF(orderData);
      if (onShowToast) onShowToast('Official Invoice PDF generated & downloaded!', 'success');
    } catch (err) {
      console.error('Error generating PDF:', err);
    }

    // 3. Construct Digital Invoice Link
    const currentOrigin = window.location.origin;
    const invoiceLink = `${currentOrigin}/?invoice=${orderId}&name=${encodeURIComponent(customerName.trim())}&phone=${encodeURIComponent(customerPhone.trim())}&addr=${encodeURIComponent(deliveryAddress.trim())}&total=${totalPayable}`;

    // 4. Format Admin WhatsApp Message
    let msg = `*MADHU SRI CRACKERS - NEW FESTIVAL ORDER*\n`;
    msg += `*Order ID:* ${orderId}\n`;
    msg += `*Date:* ${dateStr}\n\n`;
    msg += `*CUSTOMER DETAILS:*\n`;
    msg += `*Name:* ${customerName.trim()}\n`;
    msg += `*WhatsApp No:* ${customerPhone.trim()}\n`;
    msg += `*Delivery Address:* ${deliveryAddress.trim()}\n`;
    msg += `------------------------------------\n`;
    msg += `*ORDERED ITEMS (${totalCount} items):*\n`;
    cart.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.name} (${item.quantity} qty) = Rs.${item.price * item.quantity}\n`;
    });
    msg += `------------------------------------\n`;
    msg += `*Retail Value:* Rs.${originalTotal}\n`;
    msg += `*Total Festival Savings:* Rs.${festivalSavings + couponDiscount}\n`;
    msg += `*Safe Transport:* ${deliveryCharge === 0 ? 'FREE' : `Rs.${deliveryCharge}`}\n`;
    msg += `*TOTAL AMOUNT PAYABLE:* Rs.${totalPayable}\n\n`;
    msg += `*View / Download Digital Invoice Link:*\n${invoiceLink}\n\n`;
    msg += `(Official PDF Invoice has been downloaded by the customer)\n`;
    msg += `Please confirm stock availability and share parcel booking details. Thank you!`;

    const adminPhone = '919790623441';
    const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');

    // Save order record to TiDB Cloud
    await saveOrderApi({
      id: orderId,
      customerName: customerName.trim(),
      phone: customerPhone.trim(),
      address: deliveryAddress.trim(),
      totalAmount: totalPayable,
      items: cart,
      date: dateStr,
      invoiceUrl: invoiceLink
    });

    // 5. Open On-Screen Invoice Modal
    setCompletedOrder(orderData);
    setIsInvoiceModalOpen(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* 1. Page Header with Festival Accents */}
      <div className="relative bg-gradient-to-r from-white via-rose-50/70 to-amber-50/60 text-slate-900 py-8 sm:py-12 overflow-hidden shadow-2xs border-b border-rose-100/80">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-red-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 font-medium">
            <button 
              onClick={() => onNavigate && onNavigate('home')} 
              className="hover:text-red-600 transition flex items-center gap-1"
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
            <span className="text-red-600 font-bold">Checkout & Invoice</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-extrabold mb-2 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>2026 Diwali Wholesale Direct Counter</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
                Festival Cart & Direct Dispatch
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl text-right shadow-2xs">
                <div className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Total Box Items</div>
                <div className="text-lg sm:text-xl font-black text-slate-900">{totalCount} Crackers</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-sm my-12 animate-fadeIn">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-red-50 to-amber-50 text-red-500 mx-auto flex items-center justify-center mb-6 shadow-inner border border-red-100">
              <ShoppingBag className="w-12 h-12 stroke-[1.8]" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              Your Festival Cart is Empty
            </h2>
            <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
              Explore our wide range of aerial sky shots, sparkling flower pots, and family gift boxes to celebrate this Diwali with joy!
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
          /* Cart Main Content Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 7 Cols: Items Table & Delivery Progress */}
            <div className="lg:col-span-7 space-y-5">

              {/* Free Transport Progress Card */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-red-600" />
                    {subtotal >= freeDeliveryThreshold ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Free Regional Transport Unlocked!
                      </span>
                    ) : (
                      <span>
                        Add <strong className="text-red-600 font-black">₹{remainingForFreeDelivery}</strong> more to get <strong>Free Transport!</strong>
                      </span>
                    )}
                  </span>
                  <span className="text-xs font-black text-slate-700">{deliveryProgress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${deliveryProgress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span>Current Subtotal: ₹{subtotal}</span>
                  <span>Free Transport Goal: ₹{freeDeliveryThreshold}</span>
                </div>
              </div>
              
              {/* Items Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="px-5 py-4 bg-slate-50 border-b border-slate-200/70 flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                    <span>Selected Crackers</span>
                    <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                      {totalCount} items
                    </span>
                  </h3>

                  {onClearCart && (
                    <button
                      onClick={() => {
                        onClearCart();
                        if (onShowToast) onShowToast('Cart cleared', 'info');
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All</span>
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-100">
                  {cart.map((item) => {
                    const itemTotal = item.price * item.quantity;
                    const itemOriginalTotal = (item.originalPrice || item.price) * item.quantity;
                    const itemSavings = Math.max(0, itemOriginalTotal - itemTotal);

                    return (
                      <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 hover:bg-slate-50/50 transition">
                        {/* Image */}
                        <div className="w-20 h-20 rounded-xl bg-white p-2 border border-slate-200/80 shrink-0 flex items-center justify-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0 text-center sm:text-left w-full sm:w-auto">
                          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded">
                            {item.categoryName || 'Sivakasi Special'}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base mt-1 line-clamp-1">
                            {item.name}
                          </h4>
                          
                          <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                            <span className="text-xs sm:text-sm font-extrabold text-red-600">₹{item.price} each</span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-xs text-slate-400 line-through">₹{item.originalPrice}</span>
                            )}
                            {itemSavings > 0 && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                Save ₹{itemSavings}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center justify-between sm:justify-center w-full sm:w-auto gap-4">
                          <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 shadow-2xs">
                            <button
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 rounded-l-xl transition text-xs active:scale-95"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-xs font-black text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200 rounded-r-xl transition text-xs active:scale-95"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          {/* Line Total & Remove */}
                          <div className="text-right min-w-[70px]">
                            <div className="font-black text-red-600 text-sm sm:text-base">
                              ₹{itemTotal}
                            </div>
                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="text-[11px] text-slate-400 hover:text-red-500 font-medium transition inline-flex items-center gap-0.5 mt-0.5"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Table Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => onNavigate && onNavigate('shop')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-red-600 transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Add More Fireworks to Box</span>
                  </button>

                  <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Moisture-proof packing included</span>
                  </div>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950">100% Genuine Sivakasi Hub</h4>
                    <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                      Manufactured with licensed formulas, eco-conscious testing, and authentic quality assurance.
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
                  <Truck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-950">Direct Transport Dispatch</h4>
                    <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                      Fast booking via regional parcel transport services to every district across Tamil Nadu.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right 5 Cols: Sticky Order Summary & Checkout Form */}
            <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
              
              {/* Order Summary & Customer Details Card */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <FileText className="w-4 h-4 text-red-600" />
                    <span>Festival Invoice Summary</span>
                  </h3>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Wholesale Price
                  </span>
                </div>

                {/* Pricing Line Items */}
                <div className="py-4 space-y-2.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Retail MRP Total ({totalCount} items)</span>
                    <span className="font-semibold text-slate-500 line-through">₹{originalTotal}</span>
                  </div>

                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      <span>Direct Wholesale Discount</span>
                    </span>
                    <span>-₹{festivalSavings}</span>
                  </div>

                  {couponApplied && (
                    <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50/70 p-1.5 rounded-lg">
                      <span>Festival Coupon ({couponCode})</span>
                      <span>-₹{couponDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-slate-500" />
                      <span>Safe Packing & Transport</span>
                    </span>
                    <span className="font-bold text-slate-800">
                      {deliveryCharge === 0 ? (
                        <span className="text-emerald-700 font-extrabold uppercase tracking-wide">FREE</span>
                      ) : (
                        `₹${deliveryCharge}`
                      )}
                    </span>
                  </div>

                  {/* Total Payable Box */}
                  <div className="pt-3 border-t border-slate-200/80 flex justify-between items-baseline">
                    <div>
                      <span className="text-sm font-black text-slate-900">Total Payable</span>
                      <div className="text-[11px] text-emerald-600 font-bold mt-0.5">
                        Total Saved: ₹{festivalSavings + couponDiscount}!
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-black text-red-600 tracking-tight">
                        ₹{totalPayable}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Coupon Code Section */}
                <div className="mt-2 pt-3 border-t border-slate-100">
                  {couponApplied ? (
                    <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{couponCode} Applied (5% Extra Off)</span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-xs text-red-600 hover:text-red-700 font-bold underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Enter coupon (e.g. DIWALI2026)"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 uppercase"
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-slate-900 hover:bg-black text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                        >
                          Apply
                        </button>
                      </form>

                      {/* Quick Coupon Chip */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-medium">Quick Apply:</span>
                        <button
                          type="button"
                          onClick={(e) => handleApplyCoupon(e, 'DIWALI2026')}
                          className="text-[10px] font-bold text-red-700 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded-md border border-red-200 transition"
                        >
                          DIWALI2026 (5% Off)
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Customer Details Form */}
                <div className="mt-5 pt-4 border-t border-slate-100 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-red-600" />
                      <span>Delivery Details</span>
                    </span>
                    <span className="text-[10px] text-red-500 font-bold">* Mandatory</span>
                  </div>

                  <div className="space-y-3">
                    {/* Full Name */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ramesh Kumar"
                          value={customerName}
                          onChange={(e) => {
                            setCustomerName(e.target.value);
                            if (formErrors.name) setFormErrors(prev => ({ ...prev, name: null }));
                          }}
                          className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition ${
                            formErrors.name ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                          }`}
                        />
                      </div>
                      {formErrors.name && (
                        <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {formErrors.name}
                        </p>
                      )}
                    </div>

                    {/* WhatsApp Number */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        WhatsApp Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 9790623441"
                          value={customerPhone}
                          onChange={(e) => {
                            setCustomerPhone(e.target.value);
                            if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: null }));
                          }}
                          className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition ${
                            formErrors.phone ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                          }`}
                        />
                      </div>
                      {formErrors.phone && (
                        <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {formErrors.phone}
                        </p>
                      )}
                    </div>

                    {/* Full Delivery Address */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Full Delivery Address & Pincode <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                        <textarea
                          rows={2}
                          required
                          placeholder="e.g. 12, Amman Koil Street, Veerasigamani, Tenkasi - 627862"
                          value={deliveryAddress}
                          onChange={(e) => {
                            setDeliveryAddress(e.target.value);
                            if (formErrors.address) setFormErrors(prev => ({ ...prev, address: null }));
                          }}
                          className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition ${
                            formErrors.address ? 'border-red-400 bg-red-50/30' : 'border-slate-200'
                          }`}
                        />
                      </div>
                      {formErrors.address && (
                        <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {formErrors.address}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1b9e4b] text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg shadow-green-600/25 flex items-center justify-center gap-2 text-sm transition transform hover:-translate-y-0.5"
                  >
                    <MessageCircle className="w-5 h-5 fill-current" />
                    <span>Confirm Order on WhatsApp</span>
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                    <FileText className="w-3.5 h-3.5 text-red-600" />
                    <span>Auto-generates official PDF invoice for your order</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                  <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Zero Middlemen • 100% Direct Sivakasi Booking</span>
                  </span>
                </div>
              </div>

              {/* Direct Support Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-5 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1.5">
                  <PhoneCall className="w-4 h-4" />
                  <span>Veerasigamani Counter Helpline</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Have questions about parcel delivery or bulk discounts? Speak directly with our sales desk.
                </p>
                <a
                  href="tel:+919790623441"
                  className="inline-block text-base font-black text-white hover:text-amber-300 transition"
                >
                  +91 9790623441
                </a>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                  <Clock className="w-3 h-3 text-slate-400" /> Mon - Sun: 8:00 AM - 10:00 PM
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Invoice Confirmation Modal */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        orderData={completedOrder}
        onShowToast={onShowToast}
        onNavigate={onNavigate}
      />
    </div>
  );
}
