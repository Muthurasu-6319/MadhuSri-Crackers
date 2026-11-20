import React, { useState, useEffect } from 'react';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturesBar from './components/FeaturesBar';
import CategoriesSection from './components/CategoriesSection';
import BestSellersSection from './components/BestSellersSection';
import PromoBanner from './components/PromoBanner';
import WhyChooseUsSection from './components/WhyChooseUsSection';
import TestimonialsSection from './components/TestimonialsSection';
import NewsletterSection from './components/NewsletterSection';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import SearchModal from './components/SearchModal';
import ToastNotification from './components/ToastNotification';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import InvoiceModal from './components/InvoiceModal';

import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import EnquiryPage from './pages/EnquiryPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminPage from './pages/admin/AdminPage';

import { categories as initialCategories, allProducts as initialProducts } from './data/products';
import { fetchCategoriesApi, fetchProductsApi, fetchDatabaseHealth } from './utils/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'shop' | 'cart' | 'wishlist' | 'enquiry' | 'about' | 'contact' | 'admin'
  const [shopCategory, setShopCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [dbStatus, setDbStatus] = useState({ connected: false, message: 'Connecting to TiDB Cloud...' });

  // Dynamic Categories State - Synced between Admin and Public Store & persisted in localStorage
  const [categoriesList, setCategoriesList] = useState(() => {
    try {
      const saved = localStorage.getItem('madhu_sri_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (!parsed.some(c => c.id === 'all')) {
            return [{ id: 'all', name: 'All Crackers', image: '/images/cropped/prod-skyshot.png' }, ...parsed];
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading saved categories:', e);
    }
    return initialCategories;
  });

  const handleUpdateCategories = (newCategories) => {
    let fullList = [...newCategories];
    if (!fullList.some(c => c.id === 'all')) {
      fullList = [{ id: 'all', name: 'All Crackers', image: '/images/cropped/prod-skyshot.png' }, ...fullList];
    }
    setCategoriesList(fullList);
    try {
      localStorage.setItem('madhu_sri_categories', JSON.stringify(fullList));
    } catch (e) {
      console.error('Error saving categories to localStorage:', e);
    }
  };

  // Dynamic Products State - Synced between Admin and Public Store & persisted in localStorage
  const [productsList, setProductsList] = useState(() => {
    try {
      const saved = localStorage.getItem('madhu_sri_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading saved products:', e);
    }
    return initialProducts;
  });

  const handleUpdateProducts = (newProducts) => {
    setProductsList(newProducts);
    try {
      localStorage.setItem('madhu_sri_products', JSON.stringify(newProducts));
    } catch (e) {
      console.error('Error saving products to localStorage:', e);
    }
  };

  // TiDB Cloud Live Data Synchronization
  useEffect(() => {
    let isMounted = true;
    async function syncTiDBData() {
      try {
        const health = await fetchDatabaseHealth();
        if (isMounted) {
          if (health.status === 'ok') {
            setDbStatus({ connected: true, message: `Connected to TiDB Cloud (${health.database})` });
          } else {
            setDbStatus({ connected: false, message: 'TiDB Cloud (Local Fallback Active)' });
          }
        }

        const liveCats = await fetchCategoriesApi();
        if (liveCats && liveCats.length > 0 && isMounted) {
          const withAll = [{ id: 'all', name: 'All Crackers', image: '/images/cropped/prod-skyshot.png' }, ...liveCats];
          setCategoriesList(withAll);
          localStorage.setItem('madhu_sri_categories', JSON.stringify(withAll));
        }

        const liveProds = await fetchProductsApi();
        if (liveProds && liveProds.length > 0 && isMounted) {
          setProductsList(liveProds);
          localStorage.setItem('madhu_sri_products', JSON.stringify(liveProds));
        }
      } catch (err) {
        console.warn('Initial TiDB fetch notice:', err.message);
      }
    }

    syncTiDBData();
    return () => { isMounted = false; };
  }, []);

  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('madhu_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  // Direct Invoice URL inspection
  const [urlInvoiceData, setUrlInvoiceData] = useState(null);
  const [isUrlInvoiceOpen, setIsUrlInvoiceOpen] = useState(false);

  // URL Path & Query Parameter Inspection (/admin and ?invoice=...)
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      // 1. Check if URL has /admin or #/admin
      if (path.startsWith('/admin') || hash === '#/admin' || hash === '#admin') {
        setCurrentPage('admin');
        return;
      }

      // 2. Check if URL has ?invoice=
      try {
        const params = new URLSearchParams(window.location.search);
        const invoiceId = params.get('invoice');
        if (invoiceId) {
          const name = params.get('name') || 'Customer';
          const phone = params.get('phone') || '';
          const addr = params.get('addr') || '';
          const total = params.get('total') || '0';

          const fallbackData = {
            orderId: invoiceId,
            date: new Date().toLocaleDateString('en-IN'),
            customer: { name, phone, address: addr },
            items: [
              { id: '1', name: 'Madhu Sri Crackers Festival Order', categoryName: 'Crackers Box', price: Number(total) || 0, quantity: 1 }
            ],
            pricing: {
              originalTotal: Math.round(Number(total) * 1.3),
              subtotal: Number(total) || 0,
              savings: Math.round(Number(total) * 0.3),
              deliveryCharge: 0,
              totalAmount: Number(total) || 0
            }
          };

          fetch(`/api/orders/${encodeURIComponent(invoiceId)}`)
            .then(res => res.ok ? res.json() : null)
            .then(liveOrder => {
              if (liveOrder) {
                const parsedItems = typeof liveOrder.items === 'string' ? JSON.parse(liveOrder.items || '[]') : (liveOrder.items || []);
                const subtotal = parsedItems.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0);
                const orderTotal = Number(liveOrder.totalAmount) || subtotal || Number(total) || 0;
                setUrlInvoiceData({
                  orderId: liveOrder.id,
                  date: liveOrder.date || new Date().toLocaleDateString('en-IN'),
                  customer: {
                    name: liveOrder.customerName || name,
                    phone: liveOrder.phone || phone,
                    address: liveOrder.address || addr
                  },
                  items: parsedItems.length > 0 ? parsedItems : fallbackData.items,
                  pricing: {
                    originalTotal: Math.round(orderTotal * 1.3),
                    subtotal: subtotal || orderTotal,
                    savings: Math.round(orderTotal * 0.3),
                    deliveryCharge: orderTotal > 1500 ? 0 : 99,
                    totalAmount: orderTotal
                  }
                });
              } else {
                setUrlInvoiceData(fallbackData);
              }
              setIsUrlInvoiceOpen(true);
            })
            .catch(() => {
              setUrlInvoiceData(fallbackData);
              setIsUrlInvoiceOpen(true);
            });
        }
      } catch (e) {
        console.error(e);
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const handleNavigate = (page, param) => {
    setCurrentPage(page);

    if (page === 'admin') {
      if (window.location.pathname !== '/admin') {
        window.history.pushState({}, '', '/admin');
      }
    } else {
      if (window.location.pathname.startsWith('/admin')) {
        window.history.pushState({}, '', '/');
      }
      if (page === 'shop' && param && !param.startsWith('#')) {
        setShopCategory(param);
      } else if (page === 'shop' && !param) {
        setShopCategory('all');
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLoginSuccess = () => {
    try {
      sessionStorage.setItem('madhu_admin_auth', 'true');
    } catch (e) {
      console.error(e);
    }
    setIsAdminAuthenticated(true);
    showToast('Welcome, Administrator!', 'success');
  };

  const handleAdminLogout = () => {
    try {
      sessionStorage.removeItem('madhu_admin_auth');
    } catch (e) {
      console.error(e);
    }
    setIsAdminAuthenticated(false);
    showToast('Admin logged out successfully', 'info');
  };

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`${product.name} added to cart!`, 'cart');
  };

  const handleUpdateQuantity = (productId, delta) => {
    setCart((prev) => {
      return prev
        .map(item => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const handleRemoveItem = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    showToast('Item removed from cart', 'delete');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleToggleWishlist = (productId) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
        showToast('Removed from wishlist', 'wishlist-remove');
      } else {
        next.add(productId);
        showToast('Added to festival wishlist!', 'wishlist-add');
      }
      return next;
    });
  };

  const handleSubscribe = (email) => {
    showToast('Subscribed! Watch out for festival deals!', 'newsletter');
  };

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // If inside /admin route:
  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-800">
        {!isAdminAuthenticated ? (
          <AdminLoginPage 
            onLoginSuccess={handleAdminLoginSuccess}
            onBackToSite={() => handleNavigate('home')}
          />
        ) : (
          <AdminPage 
            onLogout={handleAdminLogout}
            onBackToSite={() => handleNavigate('home')}
            onShowToast={showToast}
            categories={categoriesList}
            onUpdateCategories={handleUpdateCategories}
            products={productsList}
            onUpdateProducts={handleUpdateProducts}
            dbStatus={dbStatus}
          />
        )}
        <ToastNotification toast={toast} />
      </div>
    );
  }

  // Public E-Commerce Store View
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 overflow-x-hidden w-full">
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Main Navbar with Multi-Page Navigation */}
      <Navbar 
        cartCount={cartTotalCount}
        wishlistCount={wishlist.size}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        categories={categoriesList}
      />

      {/* 3. Main Page Content Routing */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <>
            {/* Hero Section */}
            <Hero onShopNow={() => handleNavigate('shop')} />

            {/* Value Propositions Bar */}
            <FeaturesBar />

            {/* Explore Our Crackers Collection */}
            <CategoriesSection 
              onNavigate={handleNavigate} 
              categories={categoriesList}
            />

            {/* Our Best Sellers */}
            <BestSellersSection 
              onAddToCart={handleAddToCart}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              products={productsList}
            />

            {/* Special Festival Offers Promo Banner */}
            <PromoBanner onNavigate={handleNavigate} />

            {/* Why Choose Us? */}
            <WhyChooseUsSection />

            {/* What Our Customers Say (Testimonials) */}
            <TestimonialsSection />

            {/* Newsletter */}
            <NewsletterSection onSubscribe={handleSubscribe} />
          </>
        )}

        {currentPage === 'shop' && (
          <ShopPage 
            onAddToCart={handleAddToCart}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            initialCategory={shopCategory}
            onNavigate={handleNavigate}
            categories={categoriesList}
            products={productsList}
          />
        )}

        {currentPage === 'cart' && (
          <CartPage 
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'wishlist' && (
          <WishlistPage 
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onNavigate={handleNavigate}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'enquiry' && (
          <EnquiryPage 
            onShowToast={showToast}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'contact' && (
          <ContactPage onShowToast={showToast} />
        )}
      </main>

      {/* 4. Footer with Updated Real Address & Phone */}
      <Footer onNavigate={handleNavigate} />

      {/* 5. Cart Slide-over Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onViewCart={() => {
          setIsCartOpen(false);
          handleNavigate('cart');
        }}
      />

      {/* 6. Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onAddToCart={handleAddToCart}
        onNavigate={handleNavigate}
        products={productsList}
      />

      {/* 7. Toast Notification */}
      <ToastNotification toast={toast} />

      {/* 8. Floating WhatsApp Button */}
      <FloatingWhatsApp />

      {/* 9. Direct URL Invoice Inspection Modal */}
      <InvoiceModal 
        isOpen={isUrlInvoiceOpen}
        onClose={() => setIsUrlInvoiceOpen(false)}
        orderData={urlInvoiceData}
        onShowToast={showToast}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
