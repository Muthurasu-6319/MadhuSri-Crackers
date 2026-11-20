// API helper for TiDB Cloud backend
const API_BASE = '/api';

export async function fetchDatabaseHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API Health check warning:', err.message);
    return { status: 'offline', error: err.message };
  }
}

// 0. Cloudinary Image Upload
export async function uploadImageApi(file, folder = 'madhusri_crackers') {
  try {
    let base64Data = file;
    if (file instanceof File || file instanceof Blob) {
      base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });
    }

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Data, folder })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Upload failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error('Image upload error:', err);
    throw err;
  }
}

// 1. Categories
export async function fetchCategoriesApi() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error(`Categories fetch failed: ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data;
  } catch (err) {
    console.warn('Using local fallback for categories:', err.message);
  }
  return null;
}

export async function saveCategoryApi(category, originalId) {
  try {
    const isEdit = Boolean(originalId);
    const url = isEdit ? `${API_BASE}/categories/${encodeURIComponent(originalId)}` : `${API_BASE}/categories`;
    const method = isEdit ? 'PUT' : 'POST';

    // Persist to local storage immediately
    try {
      const saved = JSON.parse(localStorage.getItem('madhu_sri_categories') || '[]');
      let updated;
      if (isEdit) {
        updated = saved.map(c => c.id === originalId ? { ...c, ...category } : c);
      } else {
        updated = [...saved.filter(c => c.id !== category.id), category];
      }
      localStorage.setItem('madhu_sri_categories', JSON.stringify(updated));
    } catch (e) {}

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...category, newId: category.id })
    });
    if (!res.ok) throw new Error(`Save category failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend save category fallback to local:', err.message);
    return null;
  }
}

export async function deleteCategoryApi(id) {
  try {
    // Persist to local storage immediately
    try {
      const saved = JSON.parse(localStorage.getItem('madhu_sri_categories') || '[]');
      const updated = saved.filter(c => c.id !== id);
      localStorage.setItem('madhu_sri_categories', JSON.stringify(updated));
    } catch (e) {}

    const res = await fetch(`${API_BASE}/categories/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error(`Delete category failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend delete category fallback to local:', err.message);
    return null;
  }
}

// 2. Products
export async function fetchProductsApi() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error(`Products fetch failed: ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data;
  } catch (err) {
    console.warn('Using local fallback for products:', err.message);
  }
  return null;
}

export async function saveProductApi(product, isEdit = false) {
  try {
    const url = isEdit && product.id ? `${API_BASE}/products/${encodeURIComponent(product.id)}` : `${API_BASE}/products`;
    const method = isEdit ? 'PUT' : 'POST';

    // Update local storage immediately for seamless offline support
    try {
      const saved = JSON.parse(localStorage.getItem('madhu_sri_products') || '[]');
      let updated;
      if (isEdit) {
        updated = saved.map(p => p.id === product.id ? { ...p, ...product } : p);
      } else {
        updated = [product, ...saved.filter(p => p.id !== product.id)];
      }
      localStorage.setItem('madhu_sri_products', JSON.stringify(updated));
    } catch (e) {}

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error(`Save product failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend save product fallback to local:', err.message);
    return null;
  }
}

export async function deleteProductApi(id) {
  try {
    try {
      const saved = JSON.parse(localStorage.getItem('madhu_sri_products') || '[]');
      const updated = saved.filter(p => p.id !== id);
      localStorage.setItem('madhu_sri_products', JSON.stringify(updated));
    } catch (e) {}

    const res = await fetch(`${API_BASE}/products/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error(`Delete product failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend delete product fallback to local:', err.message);
    return null;
  }
}

export async function toggleProductStockApi(id, inStock) {
  try {
    try {
      const saved = JSON.parse(localStorage.getItem('madhu_sri_products') || '[]');
      const updated = saved.map(p => p.id === id ? { ...p, inStock: Boolean(inStock) } : p);
      localStorage.setItem('madhu_sri_products', JSON.stringify(updated));
    } catch (e) {}

    const res = await fetch(`${API_BASE}/products/${encodeURIComponent(id)}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inStock })
    });
    if (!res.ok) throw new Error(`Stock toggle failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend stock toggle fallback to local:', err.message);
    return null;
  }
}

// 3. Enquiries
export async function fetchEnquiriesApi() {
  try {
    const res = await fetch(`${API_BASE}/enquiries`);
    if (!res.ok) throw new Error(`Enquiries fetch failed: ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) return data;
  } catch (err) {
    console.warn('Backend enquiries fallback to local:', err.message);
    return null;
  }
}

export async function submitEnquiryApi(enquiryData) {
  try {
    const res = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiryData)
    });
    if (!res.ok) throw new Error(`Submit enquiry failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend submit enquiry fallback to local:', err.message);
    return null;
  }
}

export async function updateEnquiryStatusApi(id, status) {
  try {
    const res = await fetch(`${API_BASE}/enquiries/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error(`Update enquiry status failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend enquiry status fallback to local:', err.message);
    return null;
  }
}

export async function deleteEnquiryApi(id) {
  try {
    const res = await fetch(`${API_BASE}/enquiries/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error(`Delete enquiry failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend delete enquiry fallback to local:', err.message);
    return null;
  }
}

// 4. Orders
export async function saveOrderApi(orderData) {
  try {
    // Persist to local storage for offline resiliency
    try {
      const saved = JSON.parse(localStorage.getItem('madhu_sri_orders') || '[]');
      const orderEntry = {
        ...orderData,
        status: orderData.status || 'New',
        created_timestamp: new Date().toISOString()
      };
      const updated = [orderEntry, ...saved.filter(o => o.id !== orderData.id && o.orderId !== orderData.id)];
      localStorage.setItem('madhu_sri_orders', JSON.stringify(updated));
    } catch (storageErr) {
      console.warn('Orders localStorage save notice:', storageErr);
    }

    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) throw new Error(`Save order failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend save order fallback to local:', err.message);
    return null;
  }
}

export async function fetchOrdersApi() {
  try {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) throw new Error(`Orders fetch failed: ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) return data;
  } catch (err) {
    console.warn('Backend fetch orders fallback to local:', err.message);
  }
  return null;
}

export async function updateOrderStatusApi(id, status) {
  try {
    // Update local storage
    try {
      const saved = JSON.parse(localStorage.getItem('madhu_sri_orders') || '[]');
      const updated = saved.map(o => (o.id === id || o.orderId === id ? { ...o, status } : o));
      localStorage.setItem('madhu_sri_orders', JSON.stringify(updated));
    } catch (e) {}

    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error(`Update order status failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend update order status fallback to local:', err.message);
    return null;
  }
}

export async function deleteOrderApi(id) {
  try {
    // Delete from local storage
    try {
      const saved = JSON.parse(localStorage.getItem('madhu_sri_orders') || '[]');
      const updated = saved.filter(o => o.id !== id && o.orderId !== id);
      localStorage.setItem('madhu_sri_orders', JSON.stringify(updated));
    } catch (e) {}

    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error(`Delete order failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend delete order fallback to local:', err.message);
    return null;
  }
}

// 5. Customers & Reviews
export async function fetchCustomersApi() {
  try {
    const res = await fetch(`${API_BASE}/customers`);
    if (!res.ok) throw new Error(`Customers fetch failed: ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) return data;
  } catch (err) {
    console.warn('Backend fetch customers fallback to local:', err.message);
    return null;
  }
}

export async function fetchReviewsApi() {
  try {
    const res = await fetch(`${API_BASE}/reviews`);
    if (!res.ok) throw new Error(`Reviews fetch failed: ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) return data;
  } catch (err) {
    console.warn('Backend fetch reviews fallback to local:', err.message);
    return null;
  }
}
