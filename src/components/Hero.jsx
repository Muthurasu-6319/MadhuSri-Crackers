import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, Flame, Download } from 'lucide-react';

export default function Hero({ onShopNow }) {
  const canvasRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      image: '/images/cropped/hero-crackers.png',
      alt: 'Direct Sivakasi Diwali Crackers Collection 2026',
      tag: '2026 Season Open',
      tagColor: 'from-red-600 to-amber-600'
    },
    {
      image: '/images/banner.png',
      alt: 'Madhu Sri Crackers - Light Up Your Celebrations Festival Banner',
      tag: 'Direct Factory Counter',
      tagColor: 'from-amber-600 to-orange-600'
    },
    {
      image: '/images/cropped/cat-gift-boxes.png',
      alt: 'Grand Diwali Family Gift Boxes and Hampers',
      tag: 'Family Combo Hampers',
      tagColor: 'from-emerald-600 to-teal-600'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const colors = ['#ffb703', '#fb8500', '#ffd166', '#ef476f', '#06d6a0', '#ffffff', '#e63946'];

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.radius = Math.random() * 2.4 + 1.0;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.8 + 0.8;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.decay = Math.random() * 0.022 + 0.012;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.025; // gravity
        this.alpha -= this.decay;
      }
      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const spawnBurst = (x, y, count = 20) => {
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y));
      }
    };

    let animationId;
    let lastSpawn = 0;
    const animate = (timestamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Random sparkle over sky fireworks area
      if (timestamp - lastSpawn > 1600) {
        const x = Math.random() * (canvas.width * 0.82) + (canvas.width * 0.09);
        const y = Math.random() * (canvas.height * 0.42) + 25;
        spawnBurst(x, y, 16);
        lastSpawn = timestamp;
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spawnBurst(x, y, 28);
    };

    const parent = canvas.parentElement;
    parent.addEventListener('click', handleClick);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      if (parent) parent.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <section className="relative bg-gradient-to-b from-rose-50/50 via-white to-slate-50/60 pt-4 pb-12 sm:pb-16 overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Highlight Badge */}
        <div className="flex items-center justify-center mb-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600/10 via-amber-500/10 to-red-600/10 border border-red-200/80 px-4 py-1.5 rounded-full text-xs font-bold text-red-700 shadow-sm">
            <Flame className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
            <span>2026 FESTIVAL FIREWORKS SEASON OPEN</span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
            <span className="text-slate-600 font-medium hidden sm:inline">Direct Factory Wholesale Counter</span>
          </div>
        </div>

        {/* Banner Card Container with Luxury Glassmorphism & Clean Shadow */}
        <div className="relative group rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl shadow-slate-200/80 border border-slate-200/90 bg-white">
          
          {/* Main Hero Banner Image with Direct Link */}
          <a 
            href="#best-sellers" 
            onClick={onShopNow}
            className="block relative w-full aspect-[16/9] sm:aspect-[1672/941] overflow-hidden cursor-pointer bg-white"
            title="Madhu Sri Crackers - Shop Now"
          >
            <img 
              key={activeSlide}
              src={slides[activeSlide].image} 
              alt={slides[activeSlide].alt} 
              className="w-full h-full object-cover sm:object-contain bg-white transition-all duration-700 animate-fadeIn" 
              loading="eager"
            />
          </a>

          {/* Sparkles Canvas Overlay (Interactive click bursts) */}
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full pointer-events-none z-10" 
          />

          {/* Carousel Navigation Chevrons */}
          <button 
            type="button"
            onClick={() => setActiveSlide((prev) => (prev === 0 ? 2 : prev - 1))}
            aria-label="Previous Slide"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800" />
          </button>

          <button 
            type="button"
            onClick={() => setActiveSlide((prev) => (prev === 2 ? 0 : prev + 1))}
            aria-label="Next Slide"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800" />
          </button>
        </div>

        {/* Carousel Indicator Dots */}
        <div className="flex items-center justify-center gap-2 pt-4">
          <button 
            type="button"
            onClick={() => setActiveSlide(0)}
            aria-label="Slide 1"
            className={`transition-all duration-300 rounded-full ${
              activeSlide === 0 
                ? 'w-8 h-2.5 bg-gradient-to-r from-red-600 to-amber-500 shadow-sm' 
                : 'w-2.5 h-2.5 bg-slate-300 hover:bg-red-400'
            }`}
          />
          <button 
            type="button"
            onClick={() => setActiveSlide(1)}
            aria-label="Slide 2"
            className={`transition-all duration-300 rounded-full ${
              activeSlide === 1 
                ? 'w-8 h-2.5 bg-gradient-to-r from-red-600 to-amber-500 shadow-sm' 
                : 'w-2.5 h-2.5 bg-slate-300 hover:bg-red-400'
            }`}
          />
          <button 
            type="button"
            onClick={() => setActiveSlide(2)}
            aria-label="Slide 3"
            className={`transition-all duration-300 rounded-full ${
              activeSlide === 2 
                ? 'w-8 h-2.5 bg-gradient-to-r from-red-600 to-amber-500 shadow-sm' 
                : 'w-2.5 h-2.5 bg-slate-300 hover:bg-red-400'
            }`}
          />
        </div>

        {/* Quick CTA Action Ribbon */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onShopNow}
            className="btn-shimmer inline-flex items-center gap-2 bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-full shadow-lg shadow-red-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <span>Explore 2026 Wholesale Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="https://wa.me/919790623441?text=Vanakkam%20Madhu%20Sri%20Crackers%2C%20Please%20send%20the%202026%20Wholesale%20Price%20List!"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm px-5 py-3 rounded-full border border-slate-200 shadow-sm transition hover:scale-105 active:scale-95"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Get WhatsApp Price List</span>
          </a>
        </div>

      </div>
    </section>
  );
}
