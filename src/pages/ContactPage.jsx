import React, { useState } from 'react';
import { Phone, MapPin, Clock, MessageCircle, Send, CheckCircle2, Sparkles, Navigation } from 'lucide-react';

export default function ContactPage({ onShowToast }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    requirement: 'Family Festival Pack',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      if (onShowToast) onShowToast('Please enter your name and phone number', 'alert');
      return;
    }

    if (onShowToast) {
      onShowToast('Thank you! We will contact you on WhatsApp / Phone shortly.', 'success');
    }

    setFormData({
      name: '',
      phone: '',
      email: '',
      requirement: 'Family Festival Pack',
      message: ''
    });
  };

  const handleWhatsAppDirect = () => {
    const text = `*Festival Enquiry - Madhu Sri Crackers*\n\nName: ${formData.name || 'Customer'}\nPhone: ${formData.phone || 'Not provided'}\nCategory: ${formData.requirement}\nMessage: ${formData.message || 'Please send the latest festival price list.'}`;
    const url = `https://wa.me/919790623441?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white text-slate-800 animate-fadeIn">
      {/* 1. Hero Header */}
      <section className="relative bg-gradient-to-br from-rose-50/70 via-white to-amber-50/50 text-slate-900 py-16 sm:py-20 overflow-hidden border-b border-rose-100/70">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400 via-red-600 to-transparent pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>We are Here to Help Your Celebrations Sparkle</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3 text-slate-900">
            Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-amber-600">Madhu Sri Crackers</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Get in touch with us for festival price lists, bulk orders, family gift hampers, and fast delivery across Tamil Nadu.
          </p>
        </div>
      </section>

      {/* 2. Three Key Contact Cards */}
      <section className="relative -mt-8 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Phone / Mobile */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-base">Direct Mobile Support</h3>
                <p className="text-xs text-slate-500">Call or WhatsApp for immediate enquiry</p>
                <div className="pt-2">
                  <a 
                    href="tel:+919790623441" 
                    className="text-lg font-black text-red-600 hover:text-red-700 transition tracking-tight"
                  >
                    +91 9790623441
                  </a>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 mt-4 flex items-center gap-2">
              <a 
                href="https://wa.me/919790623441?text=Hi%20Madhu%20Sri%20Crackers%2C%20I%20would%20like%20to%20get%20the%20Festival%20Price%20List!" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Card 2: Store Address */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-base">Store & Office Address</h3>
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium pt-1">
                  <p className="font-bold text-slate-900">8/389/1, AMMAN COMPLEX,</p>
                  <p>CHENTHAMARAM ROAD, Veerasigamani,</p>
                  <p>Tenkasi, TAMIL NADU - 627862</p>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 mt-4">
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Amman+Complex+Veerasigamani+Tenkasi+Tamil+Nadu+627862" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Driving Directions on Google Maps</span>
              </a>
            </div>
          </div>

          {/* Card 3: Operating Hours */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-base">Working Hours</h3>
                <p className="text-xs text-slate-500">Open 7 days during festival season</p>
                <div className="pt-2 text-xs text-slate-700 space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Monday - Sunday:</span>
                    <span className="text-red-600 font-bold">9:00 AM - 10:00 PM</span>
                  </div>
                  <div className="text-[11px] text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>WhatsApp enquiries accepted 24/7</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 mt-4 text-xs text-slate-500">
              Direct counter purchase & parcel dispatch available.
            </div>
          </div>

        </div>
      </section>

      {/* 3. Contact Form & WhatsApp Direct Section */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Form: Send Message */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-lg">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Send Us a Festival Enquiry</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Fill in your details and required crackers; our team will reply promptly with best rates.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Senthil Kumar" 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile / WhatsApp No *</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    required 
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9790623441" 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Optional)</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. senthil@gmail.com" 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Enquiry Category</label>
                  <select 
                    name="requirement" 
                    value={formData.requirement}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-slate-50/50"
                  >
                    <option value="Family Festival Pack">Family Festival Gift Pack</option>
                    <option value="Wholesale Bulk Booking">Wholesale / Bulk Booking</option>
                    <option value="Sky Shots & Aerials">Sky Shots & Aerial Crackers</option>
                    <option value="Sparklers & Chakkars">Sparklers, Chakkars & Pots</option>
                    <option value="Price List Request">Request Festival Price List PDF</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Message / Cracker List</label>
                <textarea 
                  name="message" 
                  rows="4" 
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Mention any specific crackers, budget, or delivery location..." 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-slate-50/50"
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button 
                  type="submit" 
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-md shadow-red-600/20 flex items-center justify-center gap-2 transition hover:scale-105"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Enquiry</span>
                </button>

                <button 
                  type="button" 
                  onClick={handleWhatsAppDirect}
                  className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1b9e4b] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send via WhatsApp</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Info Box */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* WhatsApp Quick Order Box */}
            <div className="bg-gradient-to-br from-emerald-600 to-green-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black leading-tight">
                  Instant WhatsApp Festival Order
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                  Fastest way to get your festival crackers booked! Message directly on WhatsApp to get the 2026 discount price list and immediate order confirmation.
                </p>
                <div className="pt-2">
                  <a 
                    href="https://wa.me/919790623441?text=Hi%20Madhu%20Sri%20Crackers%2C%20Please%20send%20the%20Latest%20Festival%20Price%20List!" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 font-extrabold text-sm px-6 py-3 rounded-full shadow-lg transition hover:scale-105"
                  >
                    <span>Chat +91 9790623441</span>
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Location Map Preview */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
                <MapPin className="w-5 h-5 text-red-600" />
                <h4>Store Location</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Conveniently located at <b>Amman Complex, Chenthamaram Road, Veerasigamani</b> in Tenkasi district. Easily accessible with safe parking for retail customer pickup.
              </p>
              <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1">
                <div className="font-bold text-red-600">Madhu Sri Crackers Store</div>
                <div>8/389/1, Amman Complex, Chenthamaram Road</div>
                <div>Veerasigamani, Tenkasi - 627862</div>
                <div>Phone: +91 9790623441</div>
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}

