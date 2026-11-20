import React, { useState } from 'react';
import { 
  Building2, 
  PhoneCall, 
  MapPin, 
  Mail, 
  Clock, 
  Send, 
  MessageCircle, 
  FileText, 
  CheckCircle2, 
  Download, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Users, 
  HeartHandshake, 
  ChevronRight,
  HelpCircle,
  Calendar,
  Flame,
  ArrowRight
} from 'lucide-react';
import { submitEnquiryApi } from '../utils/api';

const EVENT_TYPES = [
  {
    id: 'marriage',
    title: 'Marriages & Receptions',
    desc: 'Grand aerial display shells, special color fountains, waterfall sparklers & entry crackers',
    icon: HeartHandshake,
    accent: 'from-rose-500/10 to-red-500/20 text-rose-600 border-rose-200'
  },
  {
    id: 'temple',
    title: 'Temple & Village Festivals',
    desc: 'High-decibel sound crackers, 50-shot repeaters, sky rockets & massive gala displays',
    icon: Building2,
    accent: 'from-amber-500/10 to-orange-500/20 text-amber-600 border-amber-200'
  },
  {
    id: 'corporate',
    title: 'Corporate Employee Gifting',
    desc: 'Customized luxury family hampers with branded greeting cards and tiered budgets',
    icon: Users,
    accent: 'from-emerald-500/10 to-teal-500/20 text-emerald-600 border-emerald-200'
  },
  {
    id: 'wholesale',
    title: 'Wholesale Retail Dealership',
    desc: 'Direct Sivakasi master cartons with full margin discounts and priority festival dispatch',
    icon: Truck,
    accent: 'from-indigo-500/10 to-purple-500/20 text-indigo-600 border-indigo-200'
  }
];

const BUDGET_PRESETS = [
  '₹10,000 - ₹25,000',
  '₹25,000 - ₹50,000',
  '₹50,000 - ₹1,00,000',
  '₹1,00,000+'
];

export default function EnquiryPage({ onShowToast, onNavigate }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: 'marriage',
    date: '',
    budget: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectEventType = (typeId) => {
    setFormData(prev => ({ ...prev, eventType: typeId }));
    const formEl = document.getElementById('enquiry-form-section');
    if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      if (onShowToast) onShowToast('Please enter your name and phone number', 'error');
      return;
    }

    setSubmitted(true);
    if (onShowToast) onShowToast('Your bulk enquiry has been received!', 'success');

    // Async save to TiDB Cloud
    await submitEnquiryApi(formData);

    // Format WhatsApp message
    let msg = `*BULK / EVENT ENQUIRY - MADHU SRI CRACKERS*\n`;
    msg += `------------------------------------\n`;
    msg += `*Name:* ${formData.name}\n`;
    msg += `*Phone:* ${formData.phone}\n`;
    if (formData.email) msg += `*Email:* ${formData.email}\n`;
    msg += `*Event Type:* ${formData.eventType.toUpperCase()}\n`;
    if (formData.date) msg += `*Required Date:* ${formData.date}\n`;
    if (formData.budget) msg += `*Estimated Budget:* ${formData.budget}\n`;
    if (formData.message) msg += `*Requirements:* ${formData.message}\n`;
    msg += `------------------------------------\n`;
    msg += `Please send the wholesale quotation and 2026 Price List. Thank you!`;

    const phone = '919790623441';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const handleDownloadPriceList = () => {
    if (onShowToast) onShowToast('Generating 2026 Official Price List...', 'info');
    
    const content = `MADHU SRI CRACKERS - WHOLESALE & FESTIVAL PRICE LIST 2026
Amman Complex, Chenthamaram Road, Veerasigamani, Tenkasi - 627862
Direct Factory Sales | Phone: +91 9790623441
----------------------------------------------------------------------
1. SKY SHOTS & AERIAL FIREWORKS
- Sky Shot 12 Multi-Color: Retail ₹400 | Festival Price: ₹299
- Mega Aerial 25 Shots Dhamaka: Retail ₹900 | Festival Price: ₹650
- 120 Shots Night Sky Spectacular: Retail ₹4500 | Festival Price: ₹3200

2. SPARKLERS & GROUND CHAKKARS
- Color Sparklers 15cm (10 Pcs): Retail ₹250 | Festival Price: ₹199
- Electric Silver Sparklers 30cm: Retail ₹320 | Festival Price: ₹240
- Deluxe Ground Chakkar (10 Pcs): Retail ₹220 | Festival Price: ₹180
- Jumbo Disco Spinning Chakkar: Retail ₹350 | Festival Price: ₹260

3. FLOWER POTS & FANCY FOUNTAINS
- Deluxe Conical Flower Pots (10 Pcs): Retail ₹300 | Festival Price: ₹255
- Special Tri-Colour Koti Pots: Retail ₹450 | Festival Price: ₹340
- Majestic Waterfall Fountain: Retail ₹420 | Festival Price: ₹310
- Peacock 5-Step Magic Fountain: Retail ₹600 | Festival Price: ₹450

4. ROCKETS & NOVELTIES
- Baby Rocket Whistling (10 Pcs): Retail ₹280 | Festival Price: ₹210
- Lunik Parachute Night Rocket: Retail ₹500 | Festival Price: ₹380

5. FESTIVAL GIFT HAMPER BOXES
- Diwali Anandham Gift Box (25 Items): Retail ₹1300 | Festival Price: ₹899
- Royal VIP Festival Hamper (45 Items): Retail ₹2800 | Festival Price: ₹1850

For Custom Marriage & Temple Festival Packages, Call +91 9790623441`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Madhu_Sri_Crackers_Wholesale_Price_List_2026.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onShowToast) onShowToast('Wholesale Price List downloaded successfully!', 'success');
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* 1. Header Banner */}
      <section className="relative bg-gradient-to-r from-white via-rose-50/70 to-amber-50/60 text-slate-900 py-14 sm:py-20 overflow-hidden shadow-2xs border-b border-rose-100/80">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-red-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 bg-red-50 border border-red-200 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-red-700 mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Wholesale, Temple & Event Bookings
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 text-slate-900">
            Bulk Orders & Event Fireworks
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Planning a grand wedding celebration, temple festival, family gathering, or looking for wholesale dealership? Get the best factory rates directly from Veerasigamani.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleDownloadPriceList}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white font-bold px-6 py-3 rounded-full text-xs shadow-md transition active:scale-95"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Download 2026 Price List</span>
            </button>
            <a
              href="https://wa.me/919790623441?text=Hi%20Madhu%20Sri%20Crackers%2C%20I%20need%20a%20quotation%20for%20bulk%20event%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-6 py-3 rounded-full text-xs shadow-md transition active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Direct WhatsApp Desk</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-medium">
          <button 
            onClick={() => onNavigate && onNavigate('home')} 
            className="hover:text-red-600 transition"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <span className="text-slate-900 font-bold">Bulk & Event Enquiry</span>
        </div>

        {/* 3. Event Types Showcase Cards (Clickable) */}
        <div className="mb-12">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-black uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
              Tailored Packages
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
              Select Your Celebration Requirement
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Tap any category below to customize your estimate and get instant quotes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {EVENT_TYPES.map((evt) => {
              const Icon = evt.icon;
              const isSelected = formData.eventType === evt.id;

              return (
                <button
                  type="button"
                  key={evt.id}
                  onClick={() => handleSelectEventType(evt.id)}
                  className={`p-6 rounded-3xl border text-left transition-all duration-300 relative group flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-gradient-to-b from-red-500/10 to-amber-500/5 border-red-500 shadow-lg shadow-red-500/10 ring-2 ring-red-500' 
                      : 'bg-white border-slate-200/80 hover:border-red-300 hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition group-hover:scale-110 ${
                      isSelected ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-base mb-1.5 flex items-center justify-between">
                      <span>{evt.title}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {evt.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                    <span className={isSelected ? 'text-red-600' : 'text-slate-600 group-hover:text-red-600'}>
                      {isSelected ? 'Selected' : 'Choose Package'}
                    </span>
                    <ArrowRight className={`w-4 h-4 transition transform group-hover:translate-x-1 ${isSelected ? 'text-red-600' : 'text-slate-400'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Main Form & Info Grid */}
        <div id="enquiry-form-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left 7 Cols: Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Submit Your Event Requirement
              </h2>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                ⚡ 30-Min Response
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Our Veerasigamani dispatch team will review your requirements and share an official itemized wholesale estimate on WhatsApp.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Ramesh Kannan"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="e.g. 9790623441"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Requirement Type
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                  >
                    <option value="marriage">Marriage Function & Reception</option>
                    <option value="temple">Temple Festival / Thiruvizha</option>
                    <option value="corporate">Corporate Staff Gift Boxes</option>
                    <option value="wholesale">Wholesale Shop Dealership</option>
                    <option value="family-bulk">Family Community Bulk Order</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Required Event Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Budget Presets & Custom Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Estimated Budget
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {BUDGET_PRESETS.map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => setFormData(prev => ({ ...prev, budget: preset }))}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition ${
                        formData.budget === preset
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  name="budget"
                  placeholder="Or enter custom budget (e.g. ₹35,000)"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Detailed Requirements / Custom Message
                </label>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Tell us what types of crackers you prefer (e.g. 50% sky shots, fancy pots, garland crackers, family hampers, etc.)"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 via-[#d32f2f] to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-lg shadow-red-600/25 active:scale-[0.99] flex items-center justify-center gap-2 text-xs sm:text-sm tracking-wide transition"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Submit & Receive Quote on WhatsApp</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Free customized quote without any purchase obligation</span>
              </div>
            </form>
          </div>

          {/* Right 5 Cols: Counter Support & Price List Card */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Download Card */}
            <div className="bg-gradient-to-br from-amber-500/10 via-red-500/5 to-rose-500/10 border border-amber-300/60 rounded-3xl p-6 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-red-950 flex items-center justify-center shrink-0 shadow-md">
                  <FileText className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    2026 Wholesale Price List
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Download our complete factory wholesale catalog featuring 200+ varieties of aerial shots, flower pots, rockets, and gift hampers with transparent wholesale rates.
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-amber-200/50 flex items-center justify-between">
                <button
                  onClick={handleDownloadPriceList}
                  className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm inline-flex items-center gap-2 transition"
                >
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>Download Price Catalog</span>
                </button>
                <span className="text-[11px] text-amber-800 font-bold">PDF / Text Format</span>
              </div>
            </div>

            {/* Direct Counter Details */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>Veerasigamani Direct Sales Counter</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Madhu Sri Crackers Hub</strong>
                    <span>8/389/1, Amman Complex, Chenthamaram Road, Veerasigamani, Tenkasi, Tamil Nadu - 627862</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <PhoneCall className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <strong className="text-slate-900 block">Counter Sales & WhatsApp Desk</strong>
                    <a href="tel:+919790623441" className="text-red-600 font-bold hover:underline">+91 9790623441</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <strong className="text-slate-900 block">Working Hours</strong>
                    <span>All Days: 8:00 AM - 10:00 PM (Festival Season)</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Amman+Complex+Veerasigamani+Tenkasi+Tamil+Nadu+627862"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs py-2.5 px-3 rounded-xl border border-slate-200 flex items-center justify-center gap-2 transition"
                >
                  <MapPin className="w-3.5 h-3.5 text-red-600" />
                  <span>Open Location in Google Maps</span>
                </a>
              </div>
            </div>

            {/* Wholesale Perks Strip */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-sm space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                Wholesale Dealer Advantage
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct Sivakasi manufacturing wholesale prices</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Custom assortment boxes tailored to your local customer demand</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Safe transport booking with regional parcel services across Tamil Nadu</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
