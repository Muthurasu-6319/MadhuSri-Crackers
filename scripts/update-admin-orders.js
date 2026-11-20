import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/pages/admin/AdminPage.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update lucide-react imports
if (!content.includes('ShoppingBag,')) {
  content = content.replace(
    '  ExternalLink \n} from \'lucide-react\';',
    '  ExternalLink,\n  ShoppingBag,\n  Download,\n  FileText,\n  Truck,\n  Printer\n} from \'lucide-react\';'
  );
  if (!content.includes('ShoppingBag,')) {
    content = content.replace(
      '  ExternalLink\n} from \'lucide-react\';',
      '  ExternalLink,\n  ShoppingBag,\n  Download,\n  FileText,\n  Truck,\n  Printer\n} from \'lucide-react\';'
    );
  }
}

// 2. Update api imports & invoice generator import
if (!content.includes('fetchOrdersApi,')) {
  content = content.replace(
    '  fetchCustomersApi,\n  fetchReviewsApi\n} from \'../../utils/api\';',
    '  fetchCustomersApi,\n  fetchReviewsApi,\n  fetchOrdersApi,\n  updateOrderStatusApi,\n  deleteOrderApi\n} from \'../../utils/api\';\nimport { generateInvoicePDF } from \'../../utils/generateInvoice\';'
  );
}

// 3. Add initialOrders and order state right before customer state
const initialOrdersCode = `
const initialOrders = [
  {
    id: 'MSC-2026-8421',
    customerName: 'Karthik Subramanian',
    phone: '9842109876',
    address: '42, South Car Street, Tenkasi - 627811',
    totalAmount: 4850,
    status: 'New',
    date: '19 Nov 2026',
    invoiceUrl: '',
    items: [
      { id: 'sky-shot-12', name: 'Sky Shot 12 Multi-Color', categoryName: 'Aerial Fireworks', price: 299, quantity: 4 },
      { id: 'colour-sparklers-10', name: 'Color Sparklers 15cm (10 Pcs)', categoryName: 'Sparklers', price: 199, quantity: 5 },
      { id: 'flower-pots-deluxe-10', name: 'Flower Pots Deluxe Giant (10 Pcs)', categoryName: 'Flower Pots', price: 349, quantity: 3 },
      { id: 'ground-chakkar-special-10', name: 'Ground Chakkar Special (10 Pcs)', categoryName: 'Ground Chakkars', price: 180, quantity: 4 }
    ]
  },
  {
    id: 'MSC-2026-7215',
    customerName: 'Meenakshi Sundaram',
    phone: '9789123450',
    address: '15/B, Railway Feeder Road, Rajapalayam, Virudhunagar - 626117',
    totalAmount: 8900,
    status: 'Confirmed',
    date: '18 Nov 2026',
    invoiceUrl: '',
    items: [
      { id: 'mega-sky-shot-25', name: 'Mega Aerial 25 Shots Dhamaka', categoryName: 'Aerial Fireworks', price: 650, quantity: 6 },
      { id: 'gift-boxes-deluxe', name: 'Royal Mahotsav Gift Box (45 Items)', categoryName: 'Gift Boxes', price: 2499, quantity: 2 }
    ]
  },
  {
    id: 'MSC-2026-6190',
    customerName: 'Anand & Co (Corporate Gifting)',
    phone: '9443109876',
    address: 'Plot 78, SIDCO Industrial Estate, Madurai - 625020',
    totalAmount: 34500,
    status: 'Packed',
    date: '17 Nov 2026',
    invoiceUrl: '',
    items: [
      { id: 'family-gift-box-30', name: 'Family Carnival Gift Box (30 Items)', categoryName: 'Gift Boxes', price: 1499, quantity: 20 },
      { id: 'electric-sparklers-30', name: 'Electric Silver Sparklers 30cm', categoryName: 'Sparklers', price: 240, quantity: 15 }
    ]
  },
  {
    id: 'MSC-2026-5302',
    customerName: 'Senthil Velan',
    phone: '9842156789',
    address: 'Amman Kovil Street, Veerasigamani, Tenkasi - 627862',
    totalAmount: 2150,
    status: 'Dispatched',
    date: '16 Nov 2026',
    invoiceUrl: '',
    items: [
      { id: 'sky-shot-12', name: 'Sky Shot 12 Multi-Color', categoryName: 'Aerial Fireworks', price: 299, quantity: 2 },
      { id: 'fancy-peacock-fountain', name: 'Fancy Peacock Musical Fountain', categoryName: 'Fancy Fountains', price: 380, quantity: 2 },
      { id: 'colour-sparklers-10', name: 'Color Sparklers 15cm (10 Pcs)', categoryName: 'Sparklers', price: 199, quantity: 4 }
    ]
  },
  {
    id: 'MSC-2026-4011',
    customerName: 'Kavitha Ramesh',
    phone: '9442187654',
    address: '88, High Ground, Tirunelveli - 627011',
    totalAmount: 3200,
    status: 'Delivered',
    date: '15 Nov 2026',
    invoiceUrl: '',
    items: [
      { id: 'flower-pots-deluxe-10', name: 'Flower Pots Deluxe Giant (10 Pcs)', categoryName: 'Flower Pots', price: 349, quantity: 4 },
      { id: 'colour-sparklers-10', name: 'Color Sparklers 15cm (10 Pcs)', categoryName: 'Sparklers', price: 199, quantity: 5 }
    ]
  }
];
`;

if (!content.includes('initialOrders = [')) {
  content = content.replace(
    '  // 4. Customers State\n  const [customers, setCustomers] = useState([',
    `${initialOrdersCode}\n  // Orders State (Synced with TiDB & WhatsApp checkout)\n  const [orders, setOrders] = useState(() => {\n    try {\n      const saved = localStorage.getItem('madhu_sri_orders');\n      if (saved) {\n        const parsed = JSON.parse(saved);\n        if (Array.isArray(parsed) && parsed.length > 0) return parsed;\n      }\n    } catch (e) {\n      console.error(e);\n    }\n    return initialOrders;\n  });\n  const [orderFilter, setOrderFilter] = useState('all');\n  const [orderSearch, setOrderSearch] = useState('');\n  const [selectedOrderForModal, setSelectedOrderForModal] = useState(null);\n  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);\n\n  // 4. Customers State\n  const [customers, setCustomers] = useState([`
  );
}

// 4. Sync live orders in fetchLiveRecords
if (!content.includes('const liveOrders = await fetchOrdersApi();')) {
  content = content.replace(
    '        const liveEnqs = await fetchEnquiriesApi();',
    `        const liveOrders = await fetchOrdersApi();
        if (liveOrders && Array.isArray(liveOrders) && liveOrders.length > 0 && isMounted) {
          const formatted = liveOrders.map(o => ({
            ...o,
            items: typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || [])
          }));
          setOrders(formatted);
          localStorage.setItem('madhu_sri_orders', JSON.stringify(formatted));
        }

        const liveEnqs = await fetchEnquiriesApi();`
  );
}

// 5. Add Order handlers and helper functions
const orderHandlersCode = `
  // ==================== ORDER HANDLERS ====================
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
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
    if (onShowToast) onShowToast(\`Order #\${orderId} marked as \${newStatus}\`, 'success');
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(\`Are you sure you want to delete order #\${orderId}?\`)) return;
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
    if (onShowToast) onShowToast(\`Order #\${orderId} deleted successfully\`, 'success');
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
      if (onShowToast) onShowToast(\`Invoice PDF for #\${order.id} downloaded!\`, 'success');
    } catch (err) {
      console.error('Error generating PDF:', err);
      if (onShowToast) onShowToast('Failed to generate PDF invoice', 'error');
    }
  };

  const handleWhatsAppCustomer = (order, customMsg) => {
    const phone = (order.phone || '').replace(/\\D/g, '');
    const cleanPhone = phone.startsWith('91') && phone.length === 12 ? phone : \`91\${phone}\`;
    const defaultMsg = \`Vanakkam \${order.customerName}! Regarding your Madhu Sri Crackers Order #\${order.id} (Status: *\${order.status || 'Confirmed'}*), your festival order amount is Rs.\${Number(order.totalAmount || 0).toLocaleString('en-IN')}. Sivakasi dispatch hub: +91 9790623441.\`;
    const text = encodeURIComponent(customMsg || defaultMsg);
    window.open(\`https://wa.me/\${cleanPhone}?text=\${text}\`, '_blank');
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
        \`"\${o.id}"\`,
        \`"\${o.date || ''}"\`,
        \`"\${(o.customerName || '').replace(/"/g, '""')}"\`,
        \`"\${o.phone || ''}"\`,
        \`"\${(o.address || '').replace(/"/g, '""')}"\`,
        Number(o.totalAmount) || 0,
        \`"\${o.status || 'New'}"\`,
        items.length
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', \`MadhuSri_Orders_\${new Date().toISOString().split('T')[0]}.csv\`);
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
`;

if (!content.includes('handleUpdateOrderStatus')) {
  content = content.replace(
    '  // ==================== PRODUCT HANDLERS ====================',
    `${orderHandlersCode}\n  // ==================== PRODUCT HANDLERS ====================`
  );
}

// 6. Add Orders to Sidebar
const sidebarOrderButton = `
            {/* Orders Management */}
            <button
              onClick={() => { setActiveTab('orders'); setMobileSidebarOpen(false); }}
              className={\`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition \${
                activeTab === 'orders' 
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }\`}
            >
              <ShoppingBag className="w-4 h-4" />
              <div className="flex-1 flex items-center justify-between">
                <span>Orders</span>
                <span className={\`text-[10px] font-bold px-2 py-0.5 rounded-full \${
                  orders.filter(o => o.status === 'New').length > 0
                    ? 'bg-amber-500 text-slate-900 animate-pulse'
                    : 'bg-slate-800 text-slate-300 font-mono'
                }\`}>
                  {orders.filter(o => o.status === 'New').length > 0 ? \`\${orders.filter(o => o.status === 'New').length} new\` : orders.length}
                </span>
              </div>
            </button>
`;

if (!content.includes('setActiveTab(\'orders\')')) {
  content = content.replace(
    '            {/* 1. Dashboard */}\n            <button\n              onClick={() => { setActiveTab(\'dashboard\'); setMobileSidebarOpen(false); }}',
    `            {/* 1. Dashboard */}\n            <button\n              onClick={() => { setActiveTab('dashboard'); setMobileSidebarOpen(false); }}`
  );
  content = content.replace(
    '            {/* 2. Products */}',
    `${sidebarOrderButton}\n            {/* 2. Products */}`
  );
}

// 7. Header Title and CSV Button
if (!content.includes('Festival Orders & Dispatch')) {
  content = content.replace(
    '                {activeTab === \'dashboard\' && \'Executive Store Dashboard\'}',
    `                {activeTab === 'dashboard' && 'Executive Store Dashboard'}
                {activeTab === 'orders' && 'Festival Orders & Parcel Dispatch'}`
  );
  content = content.replace(
    '          <div className="flex items-center gap-2.5">\n            {activeTab === \'products\' && (',
    `          <div className="flex items-center gap-2.5">
            {activeTab === 'orders' && (
              <button
                onClick={handleExportOrdersCSV}
                className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow transition"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            )}
            {activeTab === 'products' && (`
  );
}

// 8. Add Orders Metric Card to Dashboard View
if (!content.includes('Total Orders (Diwali)')) {
  content = content.replace(
    '            {/* 4 Metric Cards */}\n            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">',
    `            {/* 5 Metric Cards */}
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
              </div>`
  );
}

// 9. Add Orders View
const ordersMainView = `
        {/* ======================================================== */}
        {/* ORDERS MANAGEMENT TAB                                    */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <main className="p-4 sm:p-8 space-y-6 flex-1 animate-fadeIn">
            {/* Top Stat Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Bookings</span>
                <div className="text-xl font-black text-slate-900 mt-0.5">{orders.length} Orders</div>
                <span className="text-[10px] text-slate-500 font-medium">All customer orders</span>
              </div>
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">New Orders</span>
                <div className="text-xl font-black text-amber-700 mt-0.5">
                  {orders.filter(o => o.status === 'New').length} Pending
                </div>
                <span className="text-[10px] text-amber-600 font-medium">Action required</span>
              </div>
              <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">In Dispatch</span>
                <div className="text-xl font-black text-purple-700 mt-0.5">
                  {orders.filter(o => o.status === 'Packed' || o.status === 'Dispatched').length} Parcels
                </div>
                <span className="text-[10px] text-purple-600 font-medium">Packed & Transited</span>
              </div>
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Delivered</span>
                <div className="text-xl font-black text-emerald-700 mt-0.5">
                  {orders.filter(o => o.status === 'Delivered').length} Completed
                </div>
                <span className="text-[10px] text-emerald-600 font-medium">Safely reached</span>
              </div>
              <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-4 rounded-2xl shadow-sm col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-200">Total Order Revenue</span>
                <div className="text-xl font-black text-white mt-0.5">
                  ₹{orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0).toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-red-200 font-medium">Gross Diwali orders</span>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Order ID (#MSC-...), customer name, phone, or destination..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
                {['all', 'New', 'Confirmed', 'Packed', 'Dispatched', 'Delivered', 'Cancelled'].map((status) => {
                  const count = status === 'all' 
                    ? orders.length 
                    : orders.filter(o => (o.status || 'New').toLowerCase() === status.toLowerCase()).length;
                  return (
                    <button
                      key={status}
                      onClick={() => setOrderFilter(status)}
                      className={\`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 \${
                        orderFilter === status
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }\`}
                    >
                      <span className="capitalize">{status === 'all' ? 'All Orders' : status}</span>
                      <span className={\`text-[10px] px-1.5 py-0.2 rounded-full font-mono \${
                        orderFilter === status ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }\`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-bold text-xs text-slate-700">
                  Showing {filteredOrdersList.length} of {orders.length} Customer Orders
                </span>
                <span className="text-[11px] text-slate-500">
                  Manage Sivakasi dispatch, change live delivery status, and re-download invoices
                </span>
              </div>

              {filteredOrdersList.length === 0 ? (
                <div className="p-12 text-center text-slate-400 space-y-2">
                  <ShoppingBag className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-sm font-bold text-slate-600">No matching orders found</p>
                  <p className="text-xs">Try adjusting your search query or filter pills above.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/70 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Order ID & Date</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Delivery Destination</th>
                        <th className="py-3 px-4">Cracker Items</th>
                        <th className="py-3 px-4">Total Amount</th>
                        <th className="py-3 px-4">Status & Dispatch</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOrdersList.map((order) => {
                        const items = Array.isArray(order.items) ? order.items : (typeof order.items === 'string' ? JSON.parse(order.items || '[]') : []);
                        const totalItemCount = items.reduce((sum, it) => sum + (Number(it.quantity) || 1), 0);

                        return (
                          <tr key={order.id} className="hover:bg-slate-50/70 transition">
                            {/* Order ID & Date */}
                            <td className="py-3.5 px-4">
                              <div className="font-mono font-bold text-slate-900 text-xs">
                                #{order.id}
                              </div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>{order.date || 'Today'}</span>
                              </div>
                            </td>

                            {/* Customer */}
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-900 text-xs">{order.customerName}</div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[11px] font-mono text-slate-500">{order.phone}</span>
                                <button
                                  onClick={() => handleWhatsAppCustomer(order)}
                                  title="WhatsApp Chat with Customer"
                                  className="text-[#25D366] hover:opacity-80 transition"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 fill-[#25D366]/20" />
                                </button>
                              </div>
                            </td>

                            {/* Delivery Destination */}
                            <td className="py-3.5 px-4 max-w-[200px]">
                              <div className="flex items-start gap-1 text-[11px] text-slate-600 line-clamp-2">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                                <span>{order.address || 'Tenkasi Hub Pickup'}</span>
                              </div>
                            </td>

                            {/* Cracker Items */}
                            <td className="py-3.5 px-4">
                              <button
                                onClick={() => {
                                  setSelectedOrderForModal(order);
                                  setIsOrderModalOpen(true);
                                }}
                                className="group text-left"
                              >
                                <span className="inline-flex items-center gap-1 bg-slate-100 hover:bg-red-50 text-slate-800 hover:text-red-700 px-2 py-1 rounded-lg text-[11px] font-bold transition border border-slate-200 group-hover:border-red-200">
                                  <Package className="w-3 h-3" />
                                  <span>{totalItemCount} Items ({items.length} types)</span>
                                </span>
                                <div className="text-[10px] text-slate-400 mt-1 max-w-[180px] truncate">
                                  {items.map(it => \`\${it.name} (x\${it.quantity})\`).join(', ')}
                                </div>
                              </button>
                            </td>

                            {/* Total Amount */}
                            <td className="py-3.5 px-4">
                              <div className="font-black text-slate-900 text-sm">
                                ₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}
                              </div>
                              <span className="text-[10px] font-semibold text-emerald-600">
                                Order Placed
                              </span>
                            </td>

                            {/* Status Selector */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <select
                                  value={order.status || 'New'}
                                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                  className={\`text-xs font-bold px-2.5 py-1 rounded-xl border focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer \${getOrderStatusBadge(order.status)}\`}
                                >
                                  <option value="New">🟡 New Order</option>
                                  <option value="Confirmed">🔵 Confirmed</option>
                                  <option value="Packed">🟣 Packed</option>
                                  <option value="Dispatched">🟠 Dispatched</option>
                                  <option value="Delivered">🟢 Delivered</option>
                                  <option value="Cancelled">🔴 Cancelled</option>
                                </select>
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Download PDF Invoice */}
                                <button
                                  onClick={() => handleDownloadOrderInvoice(order)}
                                  title="Download Branded PDF Invoice"
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 transition"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>

                                {/* Inspect Order Details */}
                                <button
                                  onClick={() => {
                                    setSelectedOrderForModal(order);
                                    setIsOrderModalOpen(true);
                                  }}
                                  title="View Full Order Breakdown"
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                {/* Direct WhatsApp */}
                                <button
                                  onClick={() => handleWhatsAppCustomer(order)}
                                  title="WhatsApp Customer"
                                  className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </button>

                                {/* Delete Order */}
                                <button
                                  onClick={() => handleDeleteOrder(order.id)}
                                  title="Delete Order"
                                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
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
`;

if (!content.includes('activeTab === \'orders\' && (')) {
  content = content.replace(
    '        {/* ======================================================== */}\n        {/* 2. PRODUCTS TAB                                          */}\n        {/* ======================================================== */}\n        {activeTab === \'products\' && (',
    `${ordersMainView}\n        {/* ======================================================== */}\n        {/* 2. PRODUCTS TAB                                          */}\n        {/* ======================================================== */}\n        {activeTab === 'products' && (`
  );
}

// 10. Add Order Details Modal before the last </div>
const orderModalCode = `
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
                  <span className={\`text-[11px] font-bold px-2.5 py-0.5 rounded-full border \${getOrderStatusBadge(selectedOrderForModal.status)}\`}>
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
                    className={\`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer \${getOrderStatusBadge(selectedOrderForModal.status)}\`}
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
                  <span>Send WhatsApp Update</span>
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
`;

if (!content.includes('ORDER DETAILS INSPECTION MODAL')) {
  const lastDivIndex = content.lastIndexOf('    </div>\n  );\n}');
  if (lastDivIndex !== -1) {
    content = content.slice(0, lastDivIndex) + orderModalCode + '\n' + content.slice(lastDivIndex);
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ AdminPage.jsx updated successfully with Orders Management Tab!');

