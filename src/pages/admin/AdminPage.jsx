import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  MessageSquareText, 
  Users, 
  Star, 
  Settings, 
  LogOut, 
  Store, 
  Menu, 
  X, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  DollarSign, 
  Tag, 
  TrendingUp, 
  ArrowUpRight, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Calendar, 
  MessageCircle, 
  Save, 
  Check, 
  Eye, 
  EyeOff, 
  PhoneCall, 
  ExternalLink,
  ShoppingBag,
  Download,
  FileText,
  Truck,
  Printer,
  UploadCloud,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { 
  allProducts as initialProducts, 
  categories as initialCategories, 
  testimonials as initialTestimonials 
} from '../../data/products';
import {
  saveCategoryApi,
  deleteCategoryApi,
  saveProductApi,
  deleteProductApi,
  toggleProductStockApi,
  fetchEnquiriesApi,
  updateEnquiryStatusApi,
  deleteEnquiryApi,
  fetchCustomersApi,
  fetchReviewsApi,
  fetchOrdersApi,
  updateOrderStatusApi,
  deleteOrderApi,
  uploadImageApi
} from '../../utils/api';
import { generateInvoicePDF } from '../../utils/generateInvoice';

export default function AdminPage({ 
  onLogout, 
  onBackToSite, 
  onShowToast,
  categories: propCategories,
  onUpdateCategories,
  products: propProducts,
  onUpdateProducts,
  dbStatus
}) {
  // Navigation: 'dashboard' | 'products' | 'category' | 'enquiry' | 'customers' | 'reviews' | 'settings'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // 1. Products State
  const [products, setProducts] = useState(propProducts || initialProducts);
  useEffect(() => {
    if (propProducts) setProducts(propProducts);
  }, [propProducts]);

  const [productSearch, setProductSearch] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'aerial-skyshots',
    price: '',
    originalPrice: '',
    discount: '20% OFF',
    description: '',
    inStock: true,
    isBestSeller: false
  });

  // 2. Categories State (Synced with User Website)
  const [categoryList, setCategoryList] = useState(() => {
    const src = propCategories || initialCategories;
    return src.filter(c => c.id !== 'all');
  });
  useEffect(() => {
    if (propCategories) {
      setCategoryList(propCategories.filter(c => c.id !== 'all'));
    }
  }, [propCategories]);
  const [isUploadingProductImg, setIsUploadingProductImg] = useState(false);
  const [isUploadingCategoryImg, setIsUploadingCategoryImg] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    id: '',
    name: '',
    image: '/images/cropped/prod-skyshot.png',
    description: ''
  });

  // 3. Enquiries State (Synced with TiDB Cloud)
  const [enquiries, setEnquiries] = useState(() => {
    try {
      const saved = localStorage.getItem('madhu_sri_enquiries');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });
  const [enquiryFilter, setEnquiryFilter] = useState('all');
  const [enquirySearch, setEnquirySearch] = useState('');

  // Orders State (Synced with TiDB & WhatsApp checkout)
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('madhu_sri_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });
  const [orderFilter, setOrderFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrderForModal, setSelectedOrderForModal] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // 4. Customers State (Synced with TiDB Cloud)
  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem('madhu_sri_customers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });
  const [customerSearch, setCustomerSearch] = useState('');
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerForm, setCustomerForm] = useState({
    name: '',
    phone: '',
    city: '',
    district: 'Tenkasi',
    type: 'Regular'
  });

  // 5. Reviews State (Synced with TiDB Cloud)
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('madhu_sri_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    city: '',
    rating: 5,
    comment: '',
    status: 'Published'
  });

  // 6. Settings State (Strictly NO GST)
  const [settings, setSettings] = useState({
    storeName: 'Madhu Sri Crackers',
    tagline: 'Sivakasi Direct Fireworks Wholesale Counter',
    phone: '+91 9790623441',
    whatsapp: '919790623441',
    email: 'admin@madhusri.com',
    address: '8/389/1, Amman Complex, Chenthamaram Road, Veerasigamani, Tenkasi, Tamil Nadu - 627862',
    minOrderFreeDelivery: 1500,
    parcelDeliveryCharge: 99,
    minWholesaleOrder: 10000,
    announcementText: 'Special Festival Offers | Quality Products | Secure Shopping Across Tamil Nadu',
    couponCode: 'DIWALI2026',
    couponDiscountPct: 5,
    isSeasonalOrdersOpen: true
  });

  // Load Live Enquiries, Customers, and Reviews from TiDB Cloud
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLiveRecords = useCallback(async (notify = false) => {
    setIsRefreshing(true);
    try {
      const [liveOrders, liveEnqs, liveCusts, liveRevs] = await Promise.all([
        fetchOrdersApi(),
        fetchEnquiriesApi(),
        fetchCustomersApi(),
        fetchReviewsApi()
      ]);

      if (Array.isArray(liveOrders)) {
        const formatted = liveOrders.map(o => ({
          ...o,
          items: typeof o.items === 'string' ? (JSON.parse(o.items || '[]') || []) : (o.items || [])
        }));
        setOrders(formatted);
        try {
          localStorage.setItem('madhu_sri_orders', JSON.stringify(formatted));
        } catch (e) {}
      }

      if (Array.isArray(liveEnqs)) {
        setEnquiries(liveEnqs);
        try {
          localStorage.setItem('madhu_sri_enquiries', JSON.stringify(liveEnqs));
        } catch (e) {}
      }

      if (Array.isArray(liveCusts)) {
        setCustomers(liveCusts);
        try {
          localStorage.setItem('madhu_sri_customers', JSON.stringify(liveCusts));
        } catch (e) {}
      }

      if (Array.isArray(liveRevs)) {
        setReviews(liveRevs);
        try {
          localStorage.setItem('madhu_sri_reviews', JSON.stringify(liveRevs));
        } catch (e) {}
      }

      if (notify && onShowToast) {
        onShowToast('Synced with TiDB Cloud database', 'success');
      }
    } catch (e) {
      console.warn('Admin live records load warning:', e.message);
    } finally {
      setIsRefreshing(false);
    }
  }, [onShowToast]);

  useEffect(() => {
    fetchLiveRecords();
  }, [fetchLiveRecords]);

  // Re-fetch when switching tabs to ensure freshest data
  useEffect(() => {
    if (activeTab === 'orders' || activeTab === 'enquiry' || activeTab === 'customers' || activeTab === 'dashboard') {
      fetchLiveRecords();
    }
  }, [activeTab, fetchLiveRecords]);


  // ==================== ORDER HANDLERS ====================
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const targetOrder = orders.find(o => o.id === orderId);

    setOrders(prev => {
      const updated = prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o));
      try {
        localStorage.setItem('madhu_sri_orders', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (selectedOrderForModal && selectedOrderForModal.id === orderId) {
      setSelectedOrderForModal(prev => ({ ...prev, status: newStatus }));
    }

    await updateOrderStatusApi(orderId, newStatus);
    if (onShowToast) onShowToast(`Order #${orderId} marked as ${newStatus}`, 'success');

    // When status is set to Confirmed, automatically trigger WhatsApp confirmation with Invoice PDF link
    if (newStatus === 'Confirmed' && targetOrder) {
      handleWhatsAppCustomer({ ...targetOrder, status: 'Confirmed' });
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete order #${orderId}?`)) return;
    setOrders(prev => {
      const updated = prev.filter(o => o.id !== orderId);
      try {
        localStorage.setItem('madhu_sri_orders', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (selectedOrderForModal && selectedOrderForModal.id === orderId) {
      setIsOrderModalOpen(false);
      setSelectedOrderForModal(null);
    }

    await deleteOrderApi(orderId);
    if (onShowToast) onShowToast(`Order #${orderId} deleted successfully`, 'success');
  };

  const handleDownloadOrderInvoice = (order) => {
    try {
      const parsedItems = Array.isArray(order.items) ? order.items : (typeof order.items === 'string' ? JSON.parse(order.items) : []);
      const subtotal = parsedItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
      const orderData = {
        orderId: order.id,
        date: order.date || new Date().toLocaleDateString('en-IN'),
        customer: {
          name: order.customerName,
          phone: order.phone,
          address: order.address
        },
        items: parsedItems,
        pricing: {
          originalTotal: Math.round(subtotal * 1.3),
          subtotal: subtotal,
          savings: Math.round(subtotal * 0.3),
          deliveryCharge: subtotal > 1500 ? 0 : 99,
          totalAmount: Number(order.totalAmount) || subtotal
        }
      };
      generateInvoicePDF(orderData);
      if (onShowToast) onShowToast(`Invoice PDF for #${order.id} downloaded!`, 'success');
    } catch (err) {
      console.error('Error generating PDF:', err);
      if (onShowToast) onShowToast('Failed to generate PDF invoice', 'error');
    }
  };

  const handleWhatsAppCustomer = (order, customMsg) => {
    if (!order) return;
    const phone = (order.phone || '').replace(/\D/g, '');
    const cleanPhone = phone.startsWith('91') && phone.length === 12 ? phone : `91${phone}`;

    // Reliable Digital Invoice Link (Direct View & Download Official PDF)
    const origin = window.location.origin;
    let invoiceLink = order.invoiceUrl;
    if (!invoiceLink || !invoiceLink.startsWith('http')) {
      invoiceLink = `${origin}/?invoice=${encodeURIComponent(order.id)}&name=${encodeURIComponent(order.customerName || '')}&phone=${encodeURIComponent(order.phone || '')}&addr=${encodeURIComponent(order.address || '')}&total=${encodeURIComponent(order.totalAmount || 0)}`;
    } else {
      try {
        const urlObj = new URL(invoiceLink);
        invoiceLink = `${origin}${urlObj.search}`;
      } catch (e) {}
    }

    const statusUpper = (order.status || 'Confirmed').toUpperCase();

    let defaultMsg = `*MADHU SRI CRACKERS - FESTIVAL ORDER ${statusUpper}!* 🎇🎉\n`;
    defaultMsg += `------------------------------------\n`;
    defaultMsg += `Vanakkam *${order.customerName || 'Customer'}*!\n\n`;
    defaultMsg += `Your festival cracker order *#${order.id}* has been *${statusUpper}* by our Sivakasi dispatch counter.\n\n`;
    defaultMsg += `📦 *ORDER SUMMARY:*\n`;
    defaultMsg += `• *Order ID:* #${order.id}\n`;
    defaultMsg += `• *Total Amount:* Rs.${Number(order.totalAmount || 0).toLocaleString('en-IN')}\n`;
    defaultMsg += `• *Status:* ${order.status || 'Confirmed'}\n`;
    if (order.address) {
      defaultMsg += `• *Delivery Address:* ${order.address}\n`;
    }
    defaultMsg += `------------------------------------\n`;
    defaultMsg += `📄 *VIEW & DOWNLOAD OFFICIAL INVOICE PDF:*\n`;
    defaultMsg += `${invoiceLink}\n\n`;
    defaultMsg += `_(Click the link above to view your digital bill and download the official PDF invoice)_\n`;
    defaultMsg += `------------------------------------\n`;
    defaultMsg += `📍 *Dispatch Counter:* 8/389/1, Amman Complex, Veerasigamani, Tenkasi - 627862\n`;
    defaultMsg += `📞 *Customer Care / WhatsApp:* +91 9790623441\n\n`;
    defaultMsg += `Thank you for celebrating with Madhu Sri Crackers! Wishing you a Happy & Safe Diwali! 🪔✨`;

    const text = encodeURIComponent(customMsg || defaultMsg);
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const handleExportOrdersCSV = () => {
    if (orders.length === 0) {
      if (onShowToast) onShowToast('No orders to export', 'error');
      return;
    }

    const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Delivery Address', 'Total Amount (Rs)', 'Status', 'Items Count'];
    const rows = orders.map(o => {
      const items = Array.isArray(o.items) ? o.items : [];
      return [
        `"${o.id}"`,
        `"${o.date || ''}"`,
        `"${(o.customerName || '').replace(/"/g, '""')}"`,
        `"${o.phone || ''}"`,
        `"${(o.address || '').replace(/"/g, '""')}"`,
        Number(o.totalAmount) || 0,
        `"${o.status || 'New'}"`,
        items.length
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MadhuSri_Orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onShowToast) onShowToast('Orders list exported to CSV!', 'success');
  };

  const getOrderStatusBadge = (status) => {
    const s = (status || 'New').toLowerCase();
    switch (s) {
      case 'new':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'packed':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'dispatched':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const filteredOrdersList = orders.filter(o => {
    const matchesFilter = orderFilter === 'all' || (o.status || 'New').toLowerCase() === orderFilter.toLowerCase();
    const query = orderSearch.toLowerCase().trim();
    if (!query) return matchesFilter;
    const matchesSearch = 
      (o.id || '').toLowerCase().includes(query) ||
      (o.customerName || '').toLowerCase().includes(query) ||
      (o.phone || '').includes(query) ||
      (o.address || '').toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });


  // ==================== CLOUDINARY IMAGE UPLOAD HANDLERS ====================
  const handleProductImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      if (onShowToast) onShowToast('Please select a valid image file (PNG, JPG, WEBP)', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      if (onShowToast) onShowToast('Image size exceeds 10MB limit', 'error');
      return;
    }

    setIsUploadingProductImg(true);
    try {
      const result = await uploadImageApi(file, 'madhusri_products');
      if (result && result.url) {
        setProductForm(prev => ({ ...prev, image: result.url }));
        if (onShowToast) {
          onShowToast(
            result.provider === 'cloudinary' 
              ? 'Product image uploaded to Cloudinary!' 
              : 'Product image uploaded successfully!', 
            'success'
          );
        }
      }
    } catch (err) {
      if (onShowToast) onShowToast('Failed to upload image: ' + err.message, 'error');
    } finally {
      setIsUploadingProductImg(false);
    }
  };

  const handleCategoryImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      if (onShowToast) onShowToast('Please select a valid image file', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      if (onShowToast) onShowToast('Image size exceeds 10MB limit', 'error');
      return;
    }

    setIsUploadingCategoryImg(true);
    try {
      const result = await uploadImageApi(file, 'madhusri_categories');
      if (result && result.url) {
        setCategoryForm(prev => ({ ...prev, image: result.url }));
        if (onShowToast) {
          onShowToast(
            result.provider === 'cloudinary' 
              ? 'Category image uploaded to Cloudinary!' 
              : 'Category image uploaded successfully!', 
            'success'
          );
        }
      }
    } catch (err) {
      if (onShowToast) onShowToast('Failed to upload image: ' + err.message, 'error');
    } finally {
      setIsUploadingCategoryImg(false);
    }
  };

  // ==================== PRODUCT HANDLERS ====================
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    const defaultCat = categoryList[0]?.id || 'aerial-skyshots';
    const defaultImg = categoryList[0]?.image || '/images/cropped/prod-skyshot.png';
    setProductForm({
      name: '',
      category: defaultCat,
      price: '',
      originalPrice: '',
      discount: '20% OFF',
      image: defaultImg,
      description: '',
      inStock: true,
      isBestSeller: false
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      discount: product.discount || '',
      image: product.image || '/images/cropped/prod-skyshot.png',
      description: product.description || '',
      inStock: product.inStock !== false,
      isBestSeller: !!product.isBestSeller
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name.trim() || !productForm.price) {
      if (onShowToast) onShowToast('Please fill product name and price', 'error');
      return;
    }

    const catObj = categoryList.find(c => c.id === productForm.category);
    const categoryName = catObj ? catObj.name : 'Crackers';
    const isEdit = Boolean(editingProduct);
    const image = (productForm.image && productForm.image.trim()) ? productForm.image.trim() : (catObj?.image || '/images/cropped/prod-skyshot.png');

    let updatedProducts;
    let savedItem;
    if (isEdit) {
      savedItem = {
        ...editingProduct,
        ...productForm,
        image,
        categoryName,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice || productForm.price)
      };
      updatedProducts = products.map(p => p.id === editingProduct.id ? savedItem : p);
      if (onShowToast) onShowToast(`"${productForm.name}" updated! Syncing to database...`, 'success');
    } else {
      savedItem = {
        id: `prod-${Date.now()}`,
        ...productForm,
        image,
        categoryName,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice || productForm.price),
        rating: 4.8,
        reviews: '1',
        inStock: productForm.inStock !== false,
        isBestSeller: Boolean(productForm.isBestSeller)
      };
      updatedProducts = [savedItem, ...products];
      if (onShowToast) onShowToast(`"${productForm.name}" added to catalog! Syncing to database...`, 'success');
    }

    setProducts(updatedProducts);
    if (onUpdateProducts) {
      onUpdateProducts(updatedProducts);
    }
    setIsProductModalOpen(false);

    // Save/Update in TiDB Cloud Database
    try {
      await saveProductApi(savedItem, isEdit);
      const live = await fetchProductsApi();
      if (live && Array.isArray(live) && live.length > 0) {
        setProducts(live);
        if (onUpdateProducts) {
          onUpdateProducts(live);
        }
      }
    } catch (err) {
      console.warn('Product save notice:', err.message);
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to remove "${productName}" from the catalog and database?`)) {
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      if (onUpdateProducts) {
        onUpdateProducts(updatedProducts);
      }
      if (onShowToast) onShowToast(`"${productName}" deleted from database!`, 'delete');

      // Delete from TiDB Cloud Database
      try {
        await deleteProductApi(productId);
        const live = await fetchProductsApi();
        if (live && Array.isArray(live)) {
          setProducts(live);
          if (onUpdateProducts) {
            onUpdateProducts(live);
          }
        }
      } catch (err) {
        console.warn('Product delete notice:', err.message);
      }
    }
  };

  const handleToggleProductStock = async (productId) => {
    let nextStock = false;
    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        nextStock = !p.inStock;
        return { ...p, inStock: nextStock };
      }
      return p;
    });
    setProducts(updatedProducts);
    if (onUpdateProducts) {
      onUpdateProducts(updatedProducts);
    }
    if (onShowToast) onShowToast(`Stock status updated to ${nextStock ? 'In Stock' : 'Out of Stock'}`, 'info');

    // Update on TiDB Cloud Database
    try {
      await toggleProductStockApi(productId, nextStock);
    } catch (err) {
      console.warn('Stock toggle notice:', err.message);
    }
  };

  // ==================== CATEGORY HANDLERS ====================
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      id: '',
      name: '',
      image: '/images/cropped/prod-skyshot.png',
      description: ''
    });
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({
      id: cat.id,
      name: cat.name,
      image: cat.image || '/images/cropped/prod-skyshot.png',
      description: cat.description || ''
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      if (onShowToast) onShowToast('Please enter category name', 'error');
      return;
    }

    const originalId = editingCategory ? editingCategory.id : null;
    const slug = categoryForm.id.trim() || categoryForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const image = (categoryForm.image && categoryForm.image.trim()) ? categoryForm.image.trim() : '/images/cropped/prod-skyshot.png';

    const savedCat = {
      id: slug,
      name: categoryForm.name.trim(),
      image,
      description: categoryForm.description || ''
    };

    let updatedCategories;
    if (editingCategory) {
      updatedCategories = categoryList.map(c => c.id === originalId ? savedCat : c);
      if (onShowToast) onShowToast(`Category "${categoryForm.name}" updated! Syncing to database...`, 'success');
    } else {
      updatedCategories = [...categoryList, savedCat];
      if (onShowToast) onShowToast(`Category "${categoryForm.name}" created! Syncing to database...`, 'success');
    }

    setCategoryList(updatedCategories);
    if (onUpdateCategories) {
      onUpdateCategories(updatedCategories);
    }
    setIsCategoryModalOpen(false);

    // Save/Update in TiDB Cloud Database
    try {
      await saveCategoryApi(savedCat, originalId);
      const live = await fetchCategoriesApi();
      if (live && Array.isArray(live) && live.length > 0) {
        setCategoryList(live);
        if (onUpdateCategories) {
          onUpdateCategories(live);
        }
      }
    } catch (err) {
      console.warn('Category sync notice:', err.message);
    }
  };

  const handleDeleteCategory = async (catId, catName) => {
    if (window.confirm(`Are you sure you want to delete category "${catName}"? This will remove it from the database and user catalog.`)) {
      const updatedCategories = categoryList.filter(c => c.id !== catId);
      setCategoryList(updatedCategories);
      if (onUpdateCategories) {
        onUpdateCategories(updatedCategories);
      }
      if (onShowToast) onShowToast(`Category "${catName}" deleted! Syncing to database...`, 'info');

      // Delete from TiDB Cloud Database
      try {
        await deleteCategoryApi(catId);
        const live = await fetchCategoriesApi();
        if (live && Array.isArray(live)) {
          setCategoryList(live);
          if (onUpdateCategories) {
            onUpdateCategories(live);
          }
        }
      } catch (err) {
        console.warn('Category delete notice:', err.message);
      }
    }
  };

  // ==================== ENQUIRY HANDLERS ====================
  const handleUpdateEnquiryStatus = (enquiryId, newStatus) => {
    setEnquiries(prev => prev.map(e => e.id === enquiryId ? { ...e, status: newStatus } : e));
    // Async update on TiDB Cloud
    updateEnquiryStatusApi(enquiryId, newStatus);
    if (onShowToast) onShowToast(`Enquiry ${enquiryId} status: ${newStatus}`, 'info');
  };

  const handleDeleteEnquiry = (enquiryId) => {
    if (window.confirm('Delete this customer enquiry record?')) {
      setEnquiries(prev => prev.filter(e => e.id !== enquiryId));
      // Async delete from TiDB Cloud
      deleteEnquiryApi(enquiryId);
      if (onShowToast) onShowToast('Enquiry record deleted', 'delete');
    }
  };

  const handleReplyWhatsApp = (enquiry) => {
    let msg = `*MADHU SRI CRACKERS - OFFICIAL ESTIMATE RESPONSE*\n`;
    msg += `Dear ${enquiry.name},\n`;
    msg += `Thank you for contacting Madhu Sri Crackers regarding your *${enquiry.eventTitle}*.\n\n`;
    msg += `*Estimated Budget:* ₹${enquiry.budget}\n`;
    msg += `*Date of Celebration:* ${enquiry.date}\n`;
    msg += `------------------------------------\n`;
    msg += `We have reserved wholesale stock for your requirement. Our counter at Amman Complex, Veerasigamani is ready to dispatch your parcel. Please let us know the delivery hub location. Thank you!\n\n`;
    msg += `Madhu Sri Crackers, Veerasigamani, Tenkasi | +91 9790623441`;

    const phone = enquiry.phone.replace(/[^0-9]/g, '');
    const fullPhone = phone.length === 10 ? `91${phone}` : phone;
    const url = `https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  // ==================== CUSTOMER HANDLERS ====================
  const handleSaveCustomer = (e) => {
    e.preventDefault();
    if (!customerForm.name.trim() || !customerForm.phone.trim()) {
      if (onShowToast) onShowToast('Please fill Name and Phone number', 'error');
      return;
    }

    const newCust = {
      id: `CUST-${Date.now().toString().slice(-3)}`,
      name: customerForm.name.trim(),
      phone: customerForm.phone.trim(),
      city: customerForm.city.trim() || 'Tenkasi',
      district: customerForm.district,
      totalOrders: 1,
      totalSpent: 0,
      type: customerForm.type,
      lastOrder: 'Just Now'
    };
    setCustomers(prev => [newCust, ...prev]);
    setIsCustomerModalOpen(false);
    if (onShowToast) onShowToast(`Customer ${customerForm.name} added!`, 'success');
  };

  const handleDeleteCustomer = (custId, custName) => {
    if (window.confirm(`Delete customer profile for ${custName}?`)) {
      setCustomers(prev => prev.filter(c => c.id !== custId));
      if (onShowToast) onShowToast('Customer profile deleted', 'delete');
    }
  };

  // ==================== REVIEW HANDLERS ====================
  const handleToggleReviewStatus = (reviewId) => {
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        const nextStatus = r.status === 'Published' ? 'Hidden' : 'Published';
        if (onShowToast) onShowToast(`Review status: ${nextStatus}`, 'info');
        return { ...r, status: nextStatus };
      }
      return r;
    }));
  };

  const handleSaveReview = (e) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) {
      if (onShowToast) onShowToast('Please enter customer name and review comment', 'error');
      return;
    }

    const newRev = {
      id: Date.now(),
      name: reviewForm.name.trim(),
      city: reviewForm.city.trim() || 'Tamil Nadu',
      rating: Number(reviewForm.rating),
      comment: reviewForm.comment.trim(),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: reviewForm.status
    };
    setReviews(prev => [newRev, ...prev]);
    setIsReviewModalOpen(false);
    if (onShowToast) onShowToast('Customer review added!', 'success');
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Delete this customer review?')) {
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      if (onShowToast) onShowToast('Review deleted', 'delete');
    }
  };

  // ==================== SETTINGS HANDLER ====================
  const handleSaveSettings = (e) => {
    e.preventDefault();
    if (onShowToast) onShowToast('Madhu Sri Crackers settings saved successfully!', 'success');
  };

  // Filtered Lists
  const filteredProducts = products.filter(p => {
    if (selectedProductCategory !== 'all' && p.category !== selectedProductCategory) return false;
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      return p.name.toLowerCase().includes(q) || (p.categoryName && p.categoryName.toLowerCase().includes(q));
    }
    return true;
  });

  const filteredEnquiries = enquiries.filter(enq => {
    if (enquiryFilter !== 'all' && enq.status.toLowerCase() !== enquiryFilter.toLowerCase()) return false;
    if (enquirySearch.trim()) {
      const q = enquirySearch.toLowerCase();
      return enq.name.toLowerCase().includes(q) || enq.phone.includes(q) || enq.eventTitle.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredCustomers = customers.filter(c => {
    if (customerSearch.trim()) {
      const q = customerSearch.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.city.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800">
      
      {/* 1. Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-900 text-white flex flex-col shrink-0 overflow-hidden transition-transform duration-300
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Top: Brand info */}
        <div className="shrink-0 p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/madhusri.png" 
              alt="Madhu Sri Crackers" 
              className="w-9 h-9 object-contain"
            />
            <div className="flex flex-col">
              <span className="font-black text-red-500 text-base leading-none">Madhu Sri</span>
              <span className="font-extrabold text-[10px] uppercase tracking-wider text-slate-300 mt-0.5">Admin Portal</span>
            </div>
          </div>
          
          <button 
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links: Dashboard, Orders, Products, Category, Enquiry, Customers, Reviews, Settings */}
        <div className="flex-1 overflow-y-auto min-h-0 p-3 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
            Store Management
          </div>

            {/* 1. Dashboard */}
            <button
              onClick={() => { setActiveTab('dashboard'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition ${
                activeTab === 'dashboard' 
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>


            {/* Orders Management */}
            <button
              onClick={() => { setActiveTab('orders'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition ${
                activeTab === 'orders' 
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <div className="flex-1 flex items-center justify-between">
                <span>Orders</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  orders.filter(o => o.status === 'New').length > 0
                    ? 'bg-amber-500 text-slate-900 animate-pulse'
                    : 'bg-slate-800 text-slate-300 font-mono'
                }`}>
                  {orders.filter(o => o.status === 'New').length > 0 ? `${orders.filter(o => o.status === 'New').length} new` : orders.length}
                </span>
              </div>
            </button>

            {/* 2. Products */}
            <button
              onClick={() => { setActiveTab('products'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition ${
                activeTab === 'products' 
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <div className="flex-1 flex items-center justify-between">
                <span>Products</span>
                <span className="bg-slate-800 text-[10px] font-mono px-2 py-0.5 rounded-full text-slate-300">
                  {products.length}
                </span>
              </div>
            </button>

            {/* 3. Category */}
            <button
              onClick={() => { setActiveTab('category'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition ${
                activeTab === 'category' 
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <div className="flex-1 flex items-center justify-between">
                <span>Category</span>
                <span className="bg-slate-800 text-[10px] font-mono px-2 py-0.5 rounded-full text-slate-300">
                  {categoryList.length}
                </span>
              </div>
            </button>

            {/* 4. Enquiry */}
            <button
              onClick={() => { setActiveTab('enquiry'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition ${
                activeTab === 'enquiry' 
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <MessageSquareText className="w-4 h-4" />
              <div className="flex-1 flex items-center justify-between">
                <span>Enquiry</span>
                <span className="bg-amber-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {enquiries.filter(e => e.status === 'Pending').length} new
                </span>
              </div>
            </button>

            {/* 5. Customers */}
            <button
              onClick={() => { setActiveTab('customers'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition ${
                activeTab === 'customers' 
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <div className="flex-1 flex items-center justify-between">
                <span>Customers</span>
                <span className="bg-slate-800 text-[10px] font-mono px-2 py-0.5 rounded-full text-slate-300">
                  {customers.length}
                </span>
              </div>
            </button>

            {/* 6. Reviews */}
            <button
              onClick={() => { setActiveTab('reviews'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition ${
                activeTab === 'reviews' 
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Star className="w-4 h-4" />
              <div className="flex-1 flex items-center justify-between">
                <span>Reviews</span>
                <span className="bg-slate-800 text-[10px] font-mono px-2 py-0.5 rounded-full text-slate-300">
                  {reviews.length}
                </span>
              </div>
            </button>

            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pt-3 pb-1">
              System
            </div>

            {/* 7. Settings */}
            <button
              onClick={() => { setActiveTab('settings'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition ${
                activeTab === 'settings' 
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>

        {/* Bottom User Profile & Actions */}
        <div className="shrink-0 p-3 sm:p-4 border-t border-slate-800 space-y-2 bg-slate-950/40">
          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
              A
            </div>
            <div className="min-w-0">
              <span className="font-bold text-xs text-white block truncate">admin@madhusri.com</span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Super Admin
              </span>
            </div>
          </div>

          <button
            onClick={onBackToSite}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold py-2 px-3 rounded-xl transition"
          >
            <Store className="w-3.5 h-3.5" />
            <span>View Live Website</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 text-xs font-semibold py-2 px-3 rounded-xl transition border border-red-500/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for Mobile */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
        />
      )}

      {/* 2. Main Content View Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-x-hidden">
        
        {/* Top Navbar Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Admin Console</span>
                <span>/</span>
                <span className="capitalize font-semibold text-slate-700">{activeTab}</span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight capitalize">
                {activeTab === 'dashboard' && 'Executive Store Dashboard'}
                {activeTab === 'orders' && 'Festival Orders & Parcel Dispatch'}
                {activeTab === 'products' && 'Cracker Products Inventory'}
                {activeTab === 'category' && 'Category Management'}
                {activeTab === 'enquiry' && 'Bulk & Event Enquiries'}
                {activeTab === 'customers' && 'Customer Directory'}
                {activeTab === 'reviews' && 'Customer Reviews & Testimonials'}
                {activeTab === 'settings' && 'Store Configuration & Settings'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => fetchLiveRecords(true)}
              disabled={isRefreshing}
              title="Sync latest orders, enquiries, and customers from TiDB Cloud"
              className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl shadow-sm transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin text-red-600' : ''}`} />
              <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Sync Data'}</span>
            </button>
            {activeTab === 'orders' && (
              <button
                onClick={handleExportOrdersCSV}
                className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow transition"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            )}
            {activeTab === 'products' && (
              <button
                onClick={handleOpenAddProduct}
                className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            )}

            {activeTab === 'category' && (
              <button
                onClick={handleOpenAddCategory}
                className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            )}

            {activeTab === 'customers' && (
              <button
                onClick={() => {
                  setCustomerForm({ name: '', phone: '', city: '', district: 'Tenkasi', type: 'Regular' });
                  setIsCustomerModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Customer</span>
              </button>
            )}

            {activeTab === 'reviews' && (
              <button
                onClick={() => {
                  setReviewForm({ name: '', city: '', rating: 5, comment: '', status: 'Published' });
                  setIsReviewModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Review</span>
              </button>
            )}

            {/* TiDB Cloud Live Status Pill */}
            <div className="hidden md:flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-1.5 rounded-full font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>TiDB Cloud: <strong className="font-bold">madhusri</strong></span>
            </div>

            <span className="text-xs font-semibold text-slate-500 hidden sm:inline bg-slate-100 px-3 py-1.5 rounded-full">
              Tenkasi Dispatch
            </span>
          </div>
        </header>

        {/* ======================================================== */}
        {/* 1. DASHBOARD VIEW                                       */}
        {/* ======================================================== */}
        {activeTab === 'dashboard' && (
          <main className="p-4 sm:p-8 space-y-8 flex-1 animate-fadeIn">
            {/* 5 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div 
                onClick={() => setActiveTab('orders')}
                className="bg-gradient-to-br from-red-600 to-red-700 text-white p-5 rounded-2xl shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition"
              >
                <div>
                  <span className="text-xs font-bold text-red-200 uppercase tracking-wider">Festival Orders</span>
                  <div className="text-2xl font-black text-white mt-1">{orders.length} Bookings</div>
                  <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse"></span>
                    {orders.filter(o => o.status === 'New').length} New Pending
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>
              <div 
                onClick={() => setActiveTab('products')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition"
              >
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Products</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">{products.length} Items</div>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" /> Active Catalog
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('category')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition"
              >
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Categories</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">{categoryList.length} Types</div>
                  <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
                    Sky Shots, Pots, Sparklers...
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Layers className="w-6 h-6" />
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('enquiry')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition"
              >
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Enquiries</span>
                  <div className="text-2xl font-black text-amber-600 mt-1">
                    {enquiries.filter(e => e.status === 'Pending').length} Pending
                  </div>
                  <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
                    {enquiries.length} Total Event Bookings
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <MessageSquareText className="w-6 h-6" />
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('customers')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition"
              >
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Customers</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {customers.length} Accounts
                  </div>
                  <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                    Retail & Wholesale Buyers
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Enquiries Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Recent Enquiries */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Recent Bulk & Event Enquiries</h3>
                  <button
                    onClick={() => setActiveTab('enquiry')}
                    className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <span>View All Enquiries</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {enquiries.slice(0, 4).map((enq) => (
                    <div key={enq.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-sm">{enq.name}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            enq.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                            enq.status === 'Contacted' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {enq.status}
                          </span>
                        </div>
                        <div className="text-slate-500 mt-0.5 font-medium">{enq.eventTitle} ({enq.phone})</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{enq.message}</div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold text-slate-900 block">₹{enq.budget}</span>
                        <button
                          onClick={() => handleReplyWhatsApp(enq)}
                          className="mt-1 text-[11px] font-bold text-[#25D366] hover:underline flex items-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3" /> Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 1 Col: Counter & Direct Details */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-amber-400 font-bold text-xs uppercase tracking-wider block mb-2">
                    Official Counter Details
                  </span>
                  <h3 className="text-lg font-bold">Madhu Sri Crackers</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    8/389/1, Amman Complex, Chenthamaram Road, Veerasigamani, Tenkasi - 627862
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-700 space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 block">Dispatch WhatsApp:</span>
                      <span className="font-bold text-white text-sm">+91 9790623441</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Admin Account:</span>
                      <span className="text-white">admin@madhusri.com</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveTab('products')}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs text-center transition"
                  >
                    Inventory
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs text-center transition"
                  >
                    Settings
                  </button>
                </div>
              </div>

            </div>
          </main>
        )}

        {/* ======================================================== */}
        {/* 1.5. ORDERS MANAGEMENT TAB                                */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <main className="p-4 sm:p-8 space-y-6 flex-1 animate-fadeIn">
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search orders by Order ID, customer name, phone, address..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                >
                  <option value="all">All Orders ({orders.length})</option>
                  <option value="New">🟡 New Orders</option>
                  <option value="Confirmed">🔵 Confirmed</option>
                  <option value="Packed">🟣 Packed</option>
                  <option value="Dispatched">🟠 Dispatched</option>
                  <option value="Delivered">🟢 Delivered</option>
                  <option value="Cancelled">🔴 Cancelled</option>
                </select>

                <div className="text-xs font-bold px-3 py-2 rounded-xl bg-slate-100 text-slate-700">
                  Total: ₹{filteredOrdersList.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Orders Table Container */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Customer Orders & Parcel Dispatch</h3>
                  <p className="text-xs text-slate-500">Live order queue synced with TiDB Cloud & WhatsApp orders</p>
                </div>
                <span className="text-xs font-black text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                  {filteredOrdersList.length} {filteredOrdersList.length === 1 ? 'Order' : 'Orders'}
                </span>
              </div>

              {filteredOrdersList.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-base mb-1">No Orders Found</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    {orderSearch || orderFilter !== 'all' 
                      ? 'No orders match your filter criteria. Try clearing search filters.'
                      : 'No customer orders have been placed yet. When a customer confirms an order on the Cart page, it will automatically appear here.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                        <th className="py-3 px-4">Order ID & Date</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Delivery Address</th>
                        <th className="py-3 px-4">Items & Total</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOrdersList.map((order) => {
                        const items = Array.isArray(order.items)
                          ? order.items
                          : (typeof order.items === 'string' ? JSON.parse(order.items || '[]') : []);
                        const itemCount = items.reduce((sum, it) => sum + (Number(it.quantity) || 1), 0);

                        return (
                          <tr key={order.id} className="hover:bg-slate-50/80 transition group">
                            <td className="py-3 px-4">
                              <span className="font-black text-slate-900 block font-mono">#{order.id}</span>
                              <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                {order.date || 'Today'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-bold text-slate-800 block text-xs">{order.customerName}</span>
                              <a 
                                href={`https://wa.me/91${(order.phone || '').replace(/\D/g, '')}`} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1 mt-0.5 transition"
                              >
                                <MessageCircle className="w-3 h-3 text-emerald-500" />
                                {order.phone}
                              </a>
                            </td>
                            <td className="py-3 px-4 max-w-xs">
                              <span className="text-slate-600 text-xs line-clamp-2" title={order.address}>
                                {order.address || 'Counter Pickup'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-black text-slate-900 text-sm">
                                ₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}
                              </div>
                              <span className="text-[11px] text-slate-500">
                                {itemCount} {itemCount === 1 ? 'item' : 'items'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <select
                                value={order.status || 'New'}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer ${getOrderStatusBadge(order.status)}`}
                              >
                                <option value="New">🟡 New</option>
                                <option value="Confirmed">🔵 Confirmed</option>
                                <option value="Packed">🟣 Packed</option>
                                <option value="Dispatched">🟠 Dispatched</option>
                                <option value="Delivered">🟢 Delivered</option>
                                <option value="Cancelled">🔴 Cancelled</option>
                              </select>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedOrderForModal(order);
                                    setIsOrderModalOpen(true);
                                  }}
                                  title="View Full Order Details"
                                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDownloadOrderInvoice(order)}
                                  title="Download Official PDF Invoice"
                                  className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleWhatsAppCustomer(order)}
                                  title="Send WhatsApp Invoice Link & Confirmation"
                                  className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteOrder(order.id)}
                                  title="Delete Order Record"
                                  className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
        )}

        {/* ======================================================== */}
        {/* 2. PRODUCTS TAB                                          */}
        {/* ======================================================== */}
        {activeTab === 'products' && (
          <main className="p-4 sm:p-8 space-y-6 flex-1 animate-fadeIn">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products by name or category..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedProductCategory}
                  onChange={(e) => setSelectedProductCategory(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {categoryList.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="font-bold text-xs text-slate-700">
                  Showing {filteredProducts.length} of {products.length} Products
                </span>
                <span className="text-[11px] text-slate-500">
                  Manage Sivakasi wholesale price & stock
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/70 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Product Details</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Sale Rate</th>
                      <th className="py-3 px-4">Festival Discount</th>
                      <th className="py-3 px-4 text-center">Stock Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-contain bg-slate-50 border border-slate-200 rounded-xl p-1 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-slate-900 text-sm">{product.name}</div>
                              <div className="text-[11px] text-slate-400 line-clamp-1">{product.description}</div>
                              {product.isBestSeller && (
                                <span className="inline-block mt-1 bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                                  Bestseller
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {product.categoryName}
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-black text-slate-900 text-sm">₹{product.price}</div>
                          {product.originalPrice && (
                            <div className="text-slate-400 line-through text-[11px]">₹{product.originalPrice}</div>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded text-xs">
                            {product.discount || 'Special Offer'}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleToggleProductStock(product.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
                              product.inStock !== false 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                            title="Click to toggle In Stock / Out of Stock"
                          >
                            <span className={`w-2 h-2 rounded-full ${product.inStock !== false ? 'bg-emerald-600' : 'bg-red-600'}`} />
                            <span>{product.inStock !== false ? 'In Stock' : 'Out of Stock'}</span>
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditProduct(product)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                              title="Edit Cracker"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                              title="Remove Cracker"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}

        

        

        {/* ======================================================== */}
        {/* 3. CATEGORY TAB                                          */}
        {/* ======================================================== */}
        {activeTab === 'category' && (
          <main className="p-4 sm:p-8 space-y-6 flex-1 animate-fadeIn">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Store Categories ({categoryList.length})</h3>
                <p className="text-xs text-slate-500">Organize crackers into groups for seamless customer browsing</p>
              </div>
              <button
                onClick={handleOpenAddCategory}
                className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categoryList.map((cat) => {
                const count = products.filter(p => p.category === cat.id).length;
                return (
                  <div key={cat.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <img 
                          src={cat.image} 
                          alt={cat.name} 
                          className="w-14 h-14 object-contain rounded-xl bg-slate-50 border border-slate-200 p-1"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-base">{cat.name}</h4>
                          <span className="text-[11px] font-mono text-slate-400">Slug: {cat.id}</span>
                          <div className="text-xs text-red-600 font-bold mt-0.5">
                            {count} {count === 1 ? 'Product' : 'Products'} Listed
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setSelectedProductCategory(cat.id);
                          setActiveTab('products');
                        }}
                        className="text-xs font-bold text-slate-600 hover:text-red-600 transition"
                      >
                        View Items
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditCategory(cat)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                          title="Edit Category"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        )}

        

        

        {/* ======================================================== */}
        {/* 4. ENQUIRY TAB                                           */}
        {/* ======================================================== */}
        {activeTab === 'enquiry' && (
          <main className="p-4 sm:p-8 space-y-6 flex-1 animate-fadeIn">
            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by customer name, phone, or event..."
                  value={enquirySearch}
                  onChange={(e) => setEnquirySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto">
                {['all', 'pending', 'contacted', 'completed'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setEnquiryFilter(filter)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                      enquiryFilter === filter 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Enquiries Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filteredEnquiries.map((enq) => (
                <div key={enq.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:shadow-md transition">
                  {/* Top Row: Name, Event, Status */}
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-base">{enq.name}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          enq.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                          enq.status === 'Contacted' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {enq.status}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-red-600 mt-0.5 block">{enq.eventTitle}</span>
                      <span className="text-[11px] text-slate-400">{enq.createdAt}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Estimated Budget</span>
                      <span className="text-base font-black text-slate-900">₹{enq.budget}</span>
                    </div>
                  </div>

                  {/* Customer Contact & Event Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-800">{enq.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Date: {enq.date}</span>
                    </div>
                    {enq.email && (
                      <div className="col-span-2 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{enq.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Requirement Message */}
                  <div className="text-xs text-slate-700 bg-white border border-slate-100 p-3 rounded-xl leading-relaxed">
                    <span className="font-bold text-slate-900 block mb-1">Requirement Notes:</span>
                    {enq.message}
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-500 font-semibold">Status:</span>
                      <select
                        value={enq.status}
                        onChange={(e) => handleUpdateEnquiryStatus(enq.id, e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReplyWhatsApp(enq)}
                        className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Quote</span>
                      </button>

                      <button
                        onClick={() => handleDeleteEnquiry(enq.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Delete Enquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        )}

        

        

        {/* ======================================================== */}
        {/* 5. CUSTOMERS TAB                                         */}
        {/* ======================================================== */}
        {activeTab === 'customers' && (
          <main className="p-4 sm:p-8 space-y-6 flex-1 animate-fadeIn">
            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search customers by name, phone, or city..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                />
              </div>

              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-2 rounded-xl">
                {filteredCustomers.length} Customers Registered
              </span>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Customer Name</th>
                      <th className="py-3 px-4">WhatsApp Contact</th>
                      <th className="py-3 px-4">Delivery Location</th>
                      <th className="py-3 px-4">Buyer Tier</th>
                      <th className="py-3 px-4">Orders Placed</th>
                      <th className="py-3 px-4">Total Purchases</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCustomers.map((cust) => (
                      <tr key={cust.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 text-sm">{cust.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{cust.id}</div>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {cust.phone}
                        </td>

                        <td className="py-3.5 px-4 text-slate-600">
                          <div className="font-medium">{cust.city}</div>
                          <div className="text-[11px] text-slate-400">{cust.district}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            cust.type.includes('Wholesale') 
                              ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {cust.type}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          {cust.totalOrders} {cust.totalOrders === 1 ? 'Order' : 'Orders'}
                        </td>

                        <td className="py-3.5 px-4 font-black text-slate-900">
                          ₹{cust.totalSpent.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={`https://wa.me/91${cust.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(cust.name)}%2C%20greetings%20from%20Madhu%20Sri%20Crackers!`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>

                            <button
                              onClick={() => handleDeleteCustomer(cust.id, cust.name)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                              title="Delete Customer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}

        

        

        {/* ======================================================== */}
        {/* 6. REVIEWS TAB                                           */}
        {/* ======================================================== */}
        {activeTab === 'reviews' && (
          <main className="p-4 sm:p-8 space-y-6 flex-1 animate-fadeIn">
            {/* Top Rating Summary Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col items-center justify-center shrink-0">
                  <span className="text-3xl font-black text-amber-600 leading-none">5.0</span>
                  <div className="flex text-amber-500 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-500" />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">Customer Satisfaction Score</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Based on {reviews.length} authentic festival buyer ratings from Tamil Nadu
                  </p>
                  <span className="inline-block mt-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    100% Genuine Sivakasi Crackers Feedback
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setReviewForm({ name: '', city: '', rating: 5, comment: '', status: 'Published' });
                  setIsReviewModalOpen(true);
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition shrink-0 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Review / Testimonial</span>
              </button>
            </div>

            {/* Reviews List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 hover:shadow-md transition">
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{rev.name}</h4>
                      <span className="text-xs text-slate-500">{rev.city}</span>
                      <div className="flex text-amber-400 mt-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rev.status === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {rev.status}
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-1">{rev.date}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    "{rev.comment}"
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => handleToggleReviewStatus(rev.id)}
                      className="text-xs font-semibold text-slate-600 hover:text-red-600 transition"
                    >
                      {rev.status === 'Published' ? 'Hide from Website' : 'Publish to Website'}
                    </button>

                    <button
                      onClick={() => handleDeleteReview(rev.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        )}

        

        

        {/* ======================================================== */}
        {/* 7. SETTINGS TAB                                          */}
        {/* ======================================================== */}
        {activeTab === 'settings' && (
          <main className="p-4 sm:p-8 space-y-6 flex-1 animate-fadeIn">
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
              
              {/* Store Identity Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100 flex items-center gap-2">
                  <Store className="w-4 h-4 text-red-600" />
                  <span>Store Profile & Counter Identity</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Store Name</label>
                    <input
                      type="text"
                      value={settings.storeName}
                      onChange={(e) => setSettings(prev => ({ ...prev, storeName: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => setSettings(prev => ({ ...prev, tagline: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Official Mobile / Call</label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Dispatch Number</label>
                    <input
                      type="text"
                      value={settings.whatsapp}
                      onChange={(e) => setSettings(prev => ({ ...prev, whatsapp: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Counter Address (Displayed on Website & PDF Invoice)
                    </label>
                    <input
                      type="text"
                      value={settings.address}
                      onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery & Ordering Rules */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>Ordering & Parcel Pricing Thresholds</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Free Delivery Min Order (₹)</label>
                    <input
                      type="number"
                      value={settings.minOrderFreeDelivery}
                      onChange={(e) => setSettings(prev => ({ ...prev, minOrderFreeDelivery: Number(e.target.value) }))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Standard Parcel Charge (₹)</label>
                    <input
                      type="number"
                      value={settings.parcelDeliveryCharge}
                      onChange={(e) => setSettings(prev => ({ ...prev, parcelDeliveryCharge: Number(e.target.value) }))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Min Wholesale Order (₹)</label>
                    <input
                      type="number"
                      value={settings.minWholesaleOrder}
                      onChange={(e) => setSettings(prev => ({ ...prev, minWholesaleOrder: Number(e.target.value) }))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Promo Coupon & Announcements */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-100 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-600" />
                  <span>Festival Promo Codes & Announcement Bar</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Active Coupon Code</label>
                    <input
                      type="text"
                      value={settings.couponCode}
                      onChange={(e) => setSettings(prev => ({ ...prev, couponCode: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium uppercase focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Coupon Discount Percentage (%)</label>
                    <input
                      type="number"
                      value={settings.couponDiscountPct}
                      onChange={(e) => setSettings(prev => ({ ...prev, couponDiscountPct: Number(e.target.value) }))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Top Announcement Strip Text</label>
                    <input
                      type="text"
                      value={settings.announcementText}
                      onChange={(e) => setSettings(prev => ({ ...prev, announcementText: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Save Settings Action */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Settings</span>
                </button>
              </div>

            </form>
          </main>
        )}

      </div>

      {/* ==================== MODALS ==================== */}

      {/* 1. Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-fadeIn">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingProduct ? 'Edit Cracker Product' : 'Add New Cracker to Catalog'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cracker Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deluxe Sky Shot 50 Bursts"
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {categoryList.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Discount Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. 25% OFF"
                    value={productForm.discount}
                    onChange={(e) => setProductForm(prev => ({ ...prev, discount: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sale Price (₹) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 299"
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Retail Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 450"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm(prev => ({ ...prev, originalPrice: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. High altitude colorful aerial shots."
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product Image (Cloudinary Upload)
                </label>

                {/* Upload Zone */}
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 hover:border-red-400 rounded-2xl p-4 transition text-center relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProductImageFileChange}
                    disabled={isUploadingProductImg}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  
                  {isUploadingProductImg ? (
                    <div className="py-4 flex flex-col items-center justify-center text-red-600 gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-red-600" />
                      <span className="text-xs font-bold">Uploading to Cloudinary...</span>
                    </div>
                  ) : productForm.image ? (
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 p-1">
                        <img
                          src={productForm.image}
                          alt="Preview"
                          className="w-full h-full object-contain"
                          onError={(e) => { e.target.src = '/images/cropped/prod-skyshot.png'; }}
                        />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                          {productForm.image.includes('cloudinary') ? (
                            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <UploadCloud className="w-3 h-3" /> Cloudinary Hosted
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3" /> Image Selected
                            </span>
                          )}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5 max-w-[240px]">
                          {productForm.image}
                        </div>
                        <span className="text-[10px] text-red-600 font-semibold hover:underline block mt-0.5">
                          Click or drag new image to replace
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-3 flex flex-col items-center justify-center text-slate-500 gap-1.5">
                      <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-700">Click to upload cracker photo</span>
                      <span className="text-[10px] text-slate-400">PNG, JPG, WEBP up to 10MB (Auto-hosted on Cloudinary)</span>
                    </div>
                  )}
                </div>

                {/* Presets */}
                <div className="mt-2.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span>Or quick pick a standard cracker photo:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { name: 'Sky Shot', path: '/images/cropped/prod-skyshot.png' },
                      { name: 'Sparklers', path: '/images/cropped/prod-sparklers.png' },
                      { name: 'Flower Pots', path: '/images/cropped/prod-flowerpots.png' },
                      { name: 'Ground Chakkar', path: '/images/cropped/prod-chakkar.png' },
                      { name: 'Fancy Fountain', path: '/images/cropped/cat-fancy-fountains.png' },
                      { name: 'Gift Box', path: '/images/cropped/cat-gift-boxes.png' },
                      { name: 'Rockets', path: '/images/cropped/cat-rockets.png' }
                    ].map(img => (
                      <button
                        key={img.path}
                        type="button"
                        onClick={() => setProductForm(prev => ({ ...prev, image: img.path }))}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition ${
                          productForm.image === img.path
                            ? 'bg-red-50 border-red-400 text-red-600 font-bold shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {img.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.inStock}
                    onChange={(e) => setProductForm(prev => ({ ...prev, inStock: e.target.checked }))}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <span>In Stock Available</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isBestSeller}
                    onChange={(e) => setProductForm(prev => ({ ...prev, isBestSeller: e.target.checked }))}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <span>Mark as Bestseller</span>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition"
                >
                  {editingProduct ? 'Update Product' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add / Edit Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 animate-fadeIn">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mega Sky Shots"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category Slug (ID)</label>
                <input
                  type="text"
                  placeholder="e.g. mega-sky-shots (auto-generated if empty)"
                  value={categoryForm.id}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, id: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Thumbnail (Cloudinary Upload)
                </label>

                {/* Upload Zone */}
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 hover:border-red-400 rounded-2xl p-4 transition text-center relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCategoryImageFileChange}
                    disabled={isUploadingCategoryImg}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  
                  {isUploadingCategoryImg ? (
                    <div className="py-4 flex flex-col items-center justify-center text-red-600 gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-red-600" />
                      <span className="text-xs font-bold">Uploading to Cloudinary...</span>
                    </div>
                  ) : categoryForm.image ? (
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 p-1">
                        <img
                          src={categoryForm.image}
                          alt="Preview"
                          className="w-full h-full object-contain"
                          onError={(e) => { e.target.src = '/images/cropped/prod-skyshot.png'; }}
                        />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                          {categoryForm.image.includes('cloudinary') ? (
                            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <UploadCloud className="w-3 h-3" /> Cloudinary Hosted
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3" /> Image Selected
                            </span>
                          )}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5 max-w-[240px]">
                          {categoryForm.image}
                        </div>
                        <span className="text-[10px] text-red-600 font-semibold hover:underline block mt-0.5">
                          Click or drag new image to replace
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-3 flex flex-col items-center justify-center text-slate-500 gap-1.5">
                      <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-700">Click to upload category icon</span>
                      <span className="text-[10px] text-slate-400">PNG, JPG, WEBP up to 10MB (Auto-hosted on Cloudinary)</span>
                    </div>
                  )}
                </div>

                {/* Preset Category Thumbnails */}
                <div className="mt-2.5">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">Or choose a preset category image:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { name: 'Sky Shots', path: '/images/cropped/prod-skyshot.png' },
                      { name: 'Flower Pots', path: '/images/cropped/cat-flower-pots.png' },
                      { name: 'Sparklers', path: '/images/cropped/cat-sparklers.png' },
                      { name: 'Rockets', path: '/images/cropped/cat-rockets.png' },
                      { name: 'Chakkars', path: '/images/cropped/cat-ground-chakkars.png' },
                      { name: 'Fountains', path: '/images/cropped/cat-fancy-fountains.png' },
                      { name: 'Gift Boxes', path: '/images/cropped/cat-gift-boxes.png' }
                    ].map(preset => (
                      <button
                        key={preset.path}
                        type="button"
                        onClick={() => setCategoryForm(prev => ({ ...prev, image: preset.path }))}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition ${
                          categoryForm.image === preset.path 
                            ? 'bg-red-50 border-red-400 text-red-600 font-bold shadow-xs' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition"
                >
                  {editingCategory ? 'Update Category' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Add Customer Modal */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 animate-fadeIn">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base">Add New Customer Profile</h3>
              <button onClick={() => setIsCustomerModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muthu Krishnan"
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Number <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City / Town</label>
                  <input
                    type="text"
                    placeholder="e.g. Kadayanallur"
                    value={customerForm.city}
                    onChange={(e) => setCustomerForm(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Buyer Tier</label>
                  <select
                    value={customerForm.type}
                    onChange={(e) => setCustomerForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Regular">Regular Customer</option>
                    <option value="Wholesale VIP">Wholesale VIP</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCustomerModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Add Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 animate-fadeIn">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base">Add Customer Testimonial</h3>
              <button onClick={() => setIsReviewModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Saravanan"
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City / Town</label>
                  <input
                    type="text"
                    placeholder="e.g. Coimbatore"
                    value={reviewForm.city}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rating</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value={5}>5 Stars - Excellent</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Good</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Review Comment <span className="text-red-500">*</span></label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Excellent packaging, fast transport parcel delivery across Tamil Nadu."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* 5. ORDER DETAILS INSPECTION MODAL */}
      {isOrderModalOpen && selectedOrderForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-100">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 text-white rounded-t-3xl flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-red-200 font-bold">Customer Order Details</span>
                <h3 className="text-xl font-black mt-0.5 flex items-center gap-2">
                  <span>#{selectedOrderForModal.id}</span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getOrderStatusBadge(selectedOrderForModal.status)}`}>
                    {selectedOrderForModal.status || 'New'}
                  </span>
                </h3>
                <p className="text-xs text-red-100 mt-1">Booked on {selectedOrderForModal.date || 'Today'}</p>
              </div>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Customer Name</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedOrderForModal.customerName}</span>
                  <span className="text-slate-500 font-mono mt-1 block flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {selectedOrderForModal.phone}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Delivery Destination</span>
                  <span className="text-slate-700 font-medium mt-0.5 block flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                    <span>{selectedOrderForModal.address || 'Direct Tenkasi Counter Dispatch'}</span>
                  </span>
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-slate-400" />
                  <span>Ordered Cracker Items</span>
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold text-[10px] uppercase border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Item Name</th>
                        <th className="py-2.5 px-3 text-center">Unit Price</th>
                        <th className="py-2.5 px-3 text-center">Qty</th>
                        <th className="py-2.5 px-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(() => {
                        const items = Array.isArray(selectedOrderForModal.items) 
                          ? selectedOrderForModal.items 
                          : (typeof selectedOrderForModal.items === 'string' ? JSON.parse(selectedOrderForModal.items || '[]') : []);
                        
                        return items.map((it, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-3 font-semibold text-slate-800">
                              <div>{it.name}</div>
                              <span className="text-[10px] text-slate-400">{it.categoryName || 'Crackers'}</span>
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono">₹{it.price}</td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full text-[11px]">
                                {it.quantity || 1}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold text-slate-900 font-mono">
                              ₹{(Number(it.price) || 0) * (Number(it.quantity) || 1)}
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Total & Dispatch Status Modifier */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-500 block">Total Payable:</span>
                  <div className="text-2xl font-black text-slate-900">
                    ₹{Number(selectedOrderForModal.totalAmount || 0).toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">Update Status:</span>
                  <select
                    value={selectedOrderForModal.status || 'New'}
                    onChange={(e) => handleUpdateOrderStatus(selectedOrderForModal.id, e.target.value)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer ${getOrderStatusBadge(selectedOrderForModal.status)}`}
                  >
                    <option value="New">🟡 New Order</option>
                    <option value="Confirmed">🔵 Confirmed</option>
                    <option value="Packed">🟣 Packed</option>
                    <option value="Dispatched">🟠 Dispatched</option>
                    <option value="Delivered">🟢 Delivered</option>
                    <option value="Cancelled">🔴 Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleDownloadOrderInvoice(selectedOrderForModal)}
                  className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Invoice PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleWhatsAppCustomer(selectedOrderForModal)}
                  className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send WhatsApp Invoice & Confirmation</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
