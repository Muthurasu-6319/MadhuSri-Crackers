import React from 'react';
import { 
  X, 
  Download, 
  Printer, 
  MessageCircle, 
  CheckCircle2, 
  Share2, 
  Copy, 
  Sparkles, 
  ShieldCheck, 
  PhoneCall, 
  MapPin 
} from 'lucide-react';
import { generateInvoicePDF } from '../utils/generateInvoice';

export default function InvoiceModal({ 
  isOpen, 
  onClose, 
  orderData, 
  onShowToast,
  onNavigate 
}) {
  if (!isOpen || !orderData) return null;

  const { orderId, customer, items, pricing, date } = orderData;
  const invoiceUrl = `${window.location.origin}/?invoice=${orderId}`;

  const handleDownloadPDF = () => {
    generateInvoicePDF(orderData);
    if (onShowToast) onShowToast('Invoice PDF downloaded!', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(invoiceUrl);
    if (onShowToast) onShowToast('Invoice link copied to clipboard!', 'info');
  };

  const handleOpenWhatsAppAgain = () => {
    let msg = `*MADHU SRI CRACKERS - FESTIVAL ORDER*\n`;
    msg += `*Order ID:* ${orderId}\n`;
    msg += `*Customer:* ${customer.name}\n`;
    msg += `*WhatsApp No:* ${customer.phone}\n`;
    msg += `*Delivery Address:* ${customer.address}\n`;
    msg += `------------------------------------\n`;
    msg += `*ORDERED ITEMS:*\n`;
    items.forEach((item, idx) => {
      msg += `${idx + 1}. ${item.name} x ${item.quantity} = ₹${item.price * item.quantity}\n`;
    });
    msg += `------------------------------------\n`;
    msg += `*Items Total:* ₹${pricing.subtotal}\n`;
    msg += `*Festival Savings:* ₹${pricing.savings}\n`;
    msg += `*Safe Transport:* ${pricing.deliveryCharge === 0 ? 'FREE' : `₹${pricing.deliveryCharge}`}\n`;
    msg += `*Total Amount Payable:* ₹${pricing.totalAmount}\n\n`;
    msg += `*Invoice Link:* ${invoiceUrl}\n\n`;
    msg += `Please confirm order booking and parcel dispatch details. Thank you!`;

    const phone = '919790623441';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Modal Top Bar */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">Order Sent to Admin WhatsApp!</h3>
                <span className="bg-white text-emerald-900 text-xs font-black px-2.5 py-0.5 rounded-full shadow-sm">
                  {orderId}
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                Official PDF invoice has been generated for your order.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content - Printable / Viewable Invoice Paper */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50">
          
          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPDF}
                className="inline-flex items-center gap-1.5 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl transition"
                title="Copy digital invoice link"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy Link</span>
              </button>
            </div>

            <button
              onClick={handleOpenWhatsAppAgain}
              className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition ml-auto"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Open Admin WhatsApp</span>
            </button>
          </div>

          {/* Printable Invoice Paper Container */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 printable-area">
            
            {/* Invoice Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <img 
                  src="/madhusri.png" 
                  alt="Madhu Sri Crackers" 
                  className="w-14 h-14 object-contain rounded-xl"
                />
                <div>
                  <h2 className="text-xl font-black text-[#d32f2f] leading-none">
                    MADHU SRI CRACKERS
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">
                    Sivakasi Direct Fireworks Wholesale Counter
                  </p>
                  <p className="text-[11px] text-slate-500">
                    8/389/1, Amman Complex, Chenthamaram Road, Veerasigamani, Tenkasi - 627862
                  </p>
                  <p className="text-[11px] text-slate-700 font-bold">
                    Phone / WhatsApp: +91 9790623441
                  </p>
                </div>
              </div>

              <div className="sm:text-right text-xs text-slate-600 space-y-1">
                <span className="inline-block bg-red-100 text-red-800 font-black text-xs px-2.5 py-1 rounded">
                  FESTIVAL ESTIMATE / INVOICE
                </span>
                <div className="font-mono text-slate-900 font-bold text-sm">{orderId}</div>
                <div className="text-slate-400">Date: {date}</div>
              </div>
            </div>

            {/* Customer Details Box */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-2">
                Billed & Dispatched To
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-800">
                <div>
                  <span className="font-semibold text-slate-500">Customer Name: </span>
                  <span className="font-bold">{customer.name}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500">WhatsApp No: </span>
                  <span className="font-bold">{customer.phone}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="font-semibold text-slate-500">Delivery Address: </span>
                  <span className="font-medium">{customer.address}</span>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-[#d32f2f] text-white">
                  <tr>
                    <th className="py-2.5 px-3 font-bold">#</th>
                    <th className="py-2.5 px-3 font-bold">Cracker Item</th>
                    <th className="py-2.5 px-3 font-bold text-center">Qty</th>
                    <th className="py-2.5 px-3 font-bold text-right">Rate</th>
                    <th className="py-2.5 px-3 font-bold text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item, idx) => (
                    <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                      <td className="py-2 px-3 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-2 px-3 font-bold text-slate-800">{item.name}</td>
                      <td className="py-2 px-3 text-center text-slate-700 font-semibold">{item.quantity}</td>
                      <td className="py-2 px-3 text-right text-slate-600">₹{item.price}</td>
                      <td className="py-2 px-3 text-right font-black text-slate-900">
                        ₹{item.price * item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pricing Summary */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-2">
              <div className="text-xs text-slate-500 space-y-1.5 max-w-sm">
                <div className="font-bold text-slate-800">Payment Modes (Direct UPI):</div>
                <div>GPay / PhonePe / Paytm: <b>+91 9790623441</b></div>
                <div className="text-[11px] text-slate-400">
                  Parcel will be booked to your nearest transport hub across Tamil Nadu upon order confirmation.
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 min-w-[220px] space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Retail Total:</span>
                  <span className="font-bold text-slate-800">₹{pricing.originalTotal || pricing.subtotal}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Festival Savings:</span>
                  <span>-₹{pricing.savings}</span>
                </div>
                <div className="flex justify-between">
                  <span>Safe Transport:</span>
                  <span className="font-semibold text-slate-800">
                    {pricing.deliveryCharge === 0 ? 'FREE' : `₹${pricing.deliveryCharge}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-black text-slate-900 text-sm">
                  <span>Total Amount:</span>
                  <span className="text-base text-red-600">₹{pricing.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Footer Guarantee */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>100% Certified Legal Green Crackers - Sivakasi Quality</span>
              <span>Thank you for celebrating with Madhu Sri Crackers!</span>
            </div>

          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              if (onNavigate) onNavigate('shop');
            }}
            className="text-xs font-bold text-slate-600 hover:text-red-600 transition"
          >
            Continue Shopping
          </button>

          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-black text-white font-bold text-xs px-6 py-2.5 rounded-xl transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

