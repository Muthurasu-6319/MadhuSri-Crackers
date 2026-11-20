/**
 * Madhu Sri Crackers - Interactive Frontend Engine
 */

// Available Products Data
const productsData = [
  {
    id: 'sky-shot',
    name: 'Sky Shot',
    category: 'Aerial Fireworks',
    price: 299,
    originalPrice: 400,
    discount: '25% OFF',
    rating: '4.6',
    reviews: '1.2k',
    image: 'assets/images/cropped/prod-skyshot.png',
    description: 'Spectacular multi-color aerial sky shot bursts with dazzling stars.'
  },
  {
    id: 'colour-sparklers',
    name: 'Colour Sparklers',
    category: 'Sparklers',
    price: 199,
    originalPrice: 250,
    discount: '20% OFF',
    rating: '4.7',
    reviews: '980',
    image: 'assets/images/cropped/prod-sparklers.png',
    description: 'Vibrant multicolor sparkling hand-held sparklers for family celebrations.'
  },
  {
    id: 'flower-pots',
    name: 'Flower Pots',
    category: 'Fountains',
    price: 255,
    originalPrice: 300,
    discount: '15% OFF',
    rating: '4.6',
    reviews: '720',
    image: 'assets/images/cropped/prod-flowerpots.png',
    description: 'Traditional golden and silver shower conical flower pots with high blast height.'
  },
  {
    id: 'ground-chakkar',
    name: 'Ground Chakkar',
    category: 'Chakkars',
    price: 180,
    originalPrice: 220,
    discount: '18% OFF',
    rating: '4.5',
    reviews: '800',
    image: 'assets/images/cropped/prod-chakkar.png',
    description: 'Fast rotating vibrant ground wheels that produce mesmerizing golden rings.'
  }
];

// State
let cart = [];
let wishlist = new Set();

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  initCart();
  initSearch();
  initMobileMenu();
  initHeroCanvas();
  initNewsletter();
});

// Toast Notification
function showToast(message, icon = '🎉') {
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');
  
  if (!toast) return;
  toastMsg.textContent = message;
  toastIcon.textContent = icon;
  
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// Cart Logic
function initCart() {
  const cartTrigger = document.getElementById('cart-trigger');
  const cartClose = document.getElementById('cart-close');
  const cartBackdrop = document.getElementById('cart-backdrop');
  const cartDrawer = document.getElementById('cart-drawer');

  const openCart = () => {
    cartBackdrop.classList.add('active');
    cartDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeCart = () => {
    cartBackdrop.classList.remove('active');
    cartDrawer.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (cartTrigger) cartTrigger.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener('click', (e) => {
    if (e.target === cartBackdrop) closeCart();
  });

  // Attach add-to-cart buttons
  document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productId = btn.getAttribute('data-product-id');
      addToCart(productId);
    });
  });

  // WhatsApp Order Button
  const waBtn = document.getElementById('cart-whatsapp-order');
  if (waBtn) {
    waBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Your cart is empty! Add crackers first.', '🛒');
        return;
      }
      
      let msg = `*🎇 New Order from Madhu Sri Crackers Website 🎇*\n\n`;
      let total = 0;
      cart.forEach((item, idx) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        msg += `${idx + 1}. *${item.name}* x ${item.quantity} = ₹${itemTotal}\n`;
      });
      msg += `\n*Total Amount:* ₹${total}\n\nPlease confirm availability and payment details. Thank you!`;
      
      const phone = '919876543210';
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
    });
  }
}

function addToCart(productId) {
  const product = productsData.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
  showToast(`${product.name} added to cart!`, '🎇');

  // Trigger brief pulse on header cart icon
  const cartBadge = document.getElementById('cart-badge');
  if (cartBadge) {
    cartBadge.classList.add('scale-125');
    setTimeout(() => cartBadge.classList.remove('scale-125'), 200);
  }
}

function updateQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }
  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  updateCartUI();
}

function updateCartUI() {
  const cartBadge = document.getElementById('cart-badge');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartSavingsEl = document.getElementById('cart-savings');
  const cartTotalEl = document.getElementById('cart-total');
  const emptyCartState = document.getElementById('cart-empty-state');
  const cartFooter = document.getElementById('cart-footer');

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartBadge) cartBadge.textContent = totalCount;

  if (cart.length === 0) {
    if (cartItemsContainer) cartItemsContainer.innerHTML = '';
    if (emptyCartState) emptyCartState.classList.remove('hidden');
    if (cartFooter) cartFooter.classList.add('hidden');
    return;
  }

  if (emptyCartState) emptyCartState.classList.add('hidden');
  if (cartFooter) cartFooter.classList.remove('hidden');

  let subtotal = 0;
  let originalTotal = 0;

  if (cartItemsContainer) {
    cartItemsContainer.innerHTML = cart.map(item => {
      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;
      originalTotal += item.originalPrice * item.quantity;

      return `
        <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <img src="${item.image}" alt="${item.name}" class="w-16 h-14 object-cover rounded-lg border border-slate-200">
          <div class="flex-1">
            <h4 class="font-bold text-slate-800 text-sm">${item.name}</h4>
            <div class="text-xs text-slate-500 mb-1">₹${item.price} each</div>
            <div class="flex items-center gap-2">
              <button onclick="updateQuantity('${item.id}', -1)" class="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 text-xs">-</button>
              <span class="text-xs font-semibold px-2">${item.quantity}</span>
              <button onclick="updateQuantity('${item.id}', 1)" class="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 text-xs">+</button>
            </div>
          </div>
          <div class="text-right">
            <div class="font-bold text-red-600 text-sm">₹${itemSubtotal}</div>
            <button onclick="removeFromCart('${item.id}')" class="text-slate-400 hover:text-red-500 text-xs mt-2 transition">Remove</button>
          </div>
        </div>
      `;
    }).join('');
  }

  const savings = originalTotal - subtotal;
  if (cartSubtotalEl) cartSubtotalEl.textContent = `₹${subtotal}`;
  if (cartSavingsEl) cartSavingsEl.textContent = `₹${savings}`;
  if (cartTotalEl) cartTotalEl.textContent = `₹${subtotal}`;
}

// Wishlist Logic
function toggleWishlist(productId, btn) {
  const icon = btn.querySelector('svg');
  if (wishlist.has(productId)) {
    wishlist.delete(productId);
    btn.classList.remove('text-red-600');
    btn.classList.add('text-slate-400');
    showToast('Removed from wishlist', '🤍');
  } else {
    wishlist.add(productId);
    btn.classList.remove('text-slate-400');
    btn.classList.add('text-red-600');
    showToast('Added to festival wishlist!', '❤️');
  }
  const badge = document.getElementById('wishlist-badge');
  if (badge) badge.textContent = wishlist.size;
}

// Search Modal Logic
function initSearch() {
  const searchTrigger = document.getElementById('search-trigger');
  const searchModal = document.getElementById('search-modal');
  const searchBackdrop = document.getElementById('search-backdrop');
  const searchClose = document.getElementById('search-close');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  const openSearch = () => {
    searchModal.classList.add('active');
    searchBackdrop.classList.add('active');
    searchInput.focus();
    document.body.style.overflow = 'hidden';
  };

  const closeSearch = () => {
    searchModal.classList.remove('active');
    searchBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (searchTrigger) searchTrigger.addEventListener('click', openSearch);
  if (searchClose) searchClose.addEventListener('click', closeSearch);
  if (searchBackdrop) searchBackdrop.addEventListener('click', (e) => {
    if (e.target === searchBackdrop) closeSearch();
  });

  // Live filter
  if (searchInput && searchResults) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        searchResults.innerHTML = `<p class="text-sm text-slate-400 text-center py-6">Type to search for crackers, sparklers, sky shots...</p>`;
        return;
      }

      const matches = productsData.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      );

      if (matches.length === 0) {
        searchResults.innerHTML = `<p class="text-sm text-slate-500 text-center py-6">No crackers found matching "<b>${q}</b>". Try "Sparklers" or "Pots".</p>`;
        return;
      }

      searchResults.innerHTML = matches.map(item => `
        <div class="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition">
          <div class="flex items-center gap-3">
            <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded-lg border border-slate-200">
            <div>
              <h5 class="font-bold text-slate-800 text-sm">${item.name}</h5>
              <div class="text-xs text-red-600 font-semibold">₹${item.price} <span class="text-slate-400 line-through">₹${item.originalPrice}</span></div>
            </div>
          </div>
          <button onclick="addToCart('${item.id}'); showToast('${item.name} added!', '🛒');" class="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition">Add to Cart</button>
        </div>
      `).join('');
    });
  }
}

// Mobile Menu Drawer
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileClose = document.getElementById('mobile-drawer-close');

  if (menuBtn && mobileDrawer) {
    menuBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('hidden');
    });
  }
  if (mobileClose && mobileDrawer) {
    mobileClose.addEventListener('click', () => {
      mobileDrawer.classList.add('hidden');
    });
  }
}

// Newsletter
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('newsletter-email');
      if (input && input.value) {
        showToast('Subscribed! Get ready for festival deals! 🎆', '✨');
        input.value = '';
      }
    });
  }
}

// Hero Interactive Sparkle & Fireworks Canvas
function initHeroCanvas() {
  const canvas = document.getElementById('hero-fireworks-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const particles = [];
  const colors = ['#ffc107', '#ff5722', '#ffeb3b', '#e91e63', '#00e676', '#ffffff'];

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.radius = Math.random() * 2.5 + 1;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.5 + 0.8;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.alpha = 1;
      this.decay = Math.random() * 0.02 + 0.01;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.02; // gravity
      this.alpha -= this.decay;
    }
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function spawnBurst(x, y, count = 18) {
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(x, y));
    }
  }

  // Periodic subtle bursts
  let lastSpawn = 0;
  function animate(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (timestamp - lastSpawn > 2200) {
      const x = Math.random() * (canvas.width * 0.6) + (canvas.width * 0.2);
      const y = Math.random() * (canvas.height * 0.4) + 40;
      spawnBurst(x, y, 15);
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

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  // Click on hero canvas creates sparks
  canvas.parentElement.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spawnBurst(x, y, 22);
  });
}

