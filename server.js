import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Enable JSON body parsing (with 25mb limit for image base64 uploads) and CORS
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

// TiDB Cloud Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 4000,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper for safe DB queries
async function query(sql, params) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

// ================= API ROUTES =================

// 1. Health & TiDB Connection Check
app.get('/api/health', async (req, res) => {
  try {
    const rows = await query('SELECT DATABASE() as db, VERSION() as version, NOW() as server_time');
    res.json({
      status: 'ok',
      message: 'TiDB Cloud Connected Successfully',
      database: rows[0].db,
      version: rows[0].version,
      serverTime: rows[0].server_time
    });
  } catch (err) {
    console.error('Database health check failed:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// 1.5. Cloudinary Image Upload API
app.post('/api/upload', async (req, res) => {
  try {
    const { image, folder = 'madhusri_crackers' } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const isCloudinaryReady = Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );

    if (isCloudinaryReady) {
      console.log(`Uploading image to Cloudinary (folder: ${folder})...`);
      const result = await cloudinary.uploader.upload(image, {
        folder: folder,
        resource_type: 'image'
      });

      console.log(`✅ Uploaded to Cloudinary successfully: ${result.secure_url}`);
      return res.json({
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        provider: 'cloudinary'
      });
    } else {
      // Local fallback if Cloudinary credentials are not yet configured in .env
      const fs = await import('fs');
      const uploadsDir = path.join(__dirname, 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const matches = image.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
      if (matches) {
        const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
        const filename = `img_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}.${ext}`;
        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'));

        console.log(`Saved locally in fallback mode: /uploads/${filename}`);
        return res.json({
          success: true,
          url: `/uploads/${filename}`,
          provider: 'local',
          note: 'Saved locally. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to .env for Cloudinary cloud hosting.'
        });
      } else {
        return res.json({
          success: true,
          url: image,
          provider: 'url'
        });
      }
    }
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ error: 'Failed to upload image: ' + err.message });
  }
});

// 2. Categories API
app.get('/api/categories', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM categories ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const { id, name, image, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    const slug = id && id.trim() ? id.trim() : name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    await query(
      `INSERT INTO categories (id, name, image, description)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), image=VALUES(image), description=VALUES(description)`,
      [slug, name.trim(), image || '/images/cropped/prod-skyshot.png', description || '']
    );
    res.json({ success: true, category: { id: slug, name: name.trim(), image, description } });
  } catch (err) {
    console.error('Error saving category:', err);
    res.status(500).json({ error: 'Failed to save category' });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, description, newId } = req.body;
    const targetId = (newId && newId.trim()) ? newId.trim() : id;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    if (targetId !== id) {
      // Slug was changed: insert or update target, re-point products, delete old ID
      await query(
        `INSERT INTO categories (id, name, image, description)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name), image=VALUES(image), description=VALUES(description)`,
        [targetId, name.trim(), image || '/images/cropped/prod-skyshot.png', description || '']
      );
      await query('UPDATE products SET category = ?, categoryName = ? WHERE category = ?', [targetId, name.trim(), id]);
      await query('DELETE FROM categories WHERE id = ?', [id]);
    } else {
      await query(
        `UPDATE categories SET name = ?, image = ?, description = ? WHERE id = ?`,
        [name.trim(), image || '/images/cropped/prod-skyshot.png', description || '', id]
      );
      await query('UPDATE products SET categoryName = ? WHERE category = ?', [name.trim(), id]);
    }

    res.json({ success: true, category: { id: targetId, name: name.trim(), image, description } });
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ error: 'Failed to update category: ' + err.message });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ success: true, message: `Category ${id} deleted` });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ error: 'Failed to delete category: ' + err.message });
  }
});

// 3. Products API
app.get('/api/products', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM products ORDER BY created_at DESC');
    // Format boolean fields properly
    const formatted = rows.map(p => ({
      ...p,
      price: Number(p.price),
      originalPrice: Number(p.originalPrice),
      rating: Number(p.rating),
      inStock: Boolean(p.inStock),
      isBestSeller: Boolean(p.isBestSeller)
    }));
    res.json(formatted);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const p = req.body;
    const id = p.id || `prod-${Date.now()}`;
    await query(
      `INSERT INTO products 
       (id, name, category, categoryName, price, originalPrice, discount, rating, reviews, image, description, inStock, isBestSeller)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         name=VALUES(name), category=VALUES(category), categoryName=VALUES(categoryName),
         price=VALUES(price), originalPrice=VALUES(originalPrice), discount=VALUES(discount),
         description=VALUES(description), inStock=VALUES(inStock), isBestSeller=VALUES(isBestSeller)`,
      [
        id,
        p.name,
        p.category,
        p.categoryName || 'Crackers',
        p.price,
        p.originalPrice || p.price,
        p.discount || '',
        p.rating || 4.8,
        p.reviews || '1',
        p.image || '/images/cropped/prod-skyshot.png',
        p.description || '',
        p.inStock !== false,
        !!p.isBestSeller
      ]
    );
    res.json({ success: true, product: { ...p, id } });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const p = req.body;
    await query(
      `UPDATE products SET
         name=?, category=?, categoryName=?, price=?, originalPrice=?,
         discount=?, rating=?, reviews=?, image=?, description=?, inStock=?, isBestSeller=?
       WHERE id=?`,
      [
        p.name,
        p.category,
        p.categoryName || 'Crackers',
        p.price,
        p.originalPrice || p.price,
        p.discount || '',
        p.rating || 4.8,
        p.reviews || '1',
        p.image || '/images/cropped/prod-skyshot.png',
        p.description || '',
        p.inStock !== false,
        !!p.isBestSeller,
        id
      ]
    );
    res.json({ success: true, product: { ...p, id } });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Failed to update product: ' + err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ success: true, message: `Product ${id} deleted` });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.patch('/api/products/:id/stock', async (req, res) => {
  try {
    const { id } = req.params;
    const { inStock } = req.body;
    await query('UPDATE products SET inStock = ? WHERE id = ?', [Boolean(inStock), id]);
    res.json({ success: true, id, inStock: Boolean(inStock) });
  } catch (err) {
    console.error('Error updating stock status:', err);
    res.status(500).json({ error: 'Failed to update stock status' });
  }
});

// 4. Enquiries API
app.get('/api/enquiries', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM enquiries ORDER BY created_timestamp DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching enquiries:', err);
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
});

app.post('/api/enquiries', async (req, res) => {
  try {
    const e = req.body;
    const id = e.id || `ENQ-${Date.now().toString().slice(-4)}`;
    const eventType = e.eventType || 'Festival';
    const eventTitle = e.eventTitle || `${eventType.charAt(0).toUpperCase() + eventType.slice(1)} Fireworks Requirement`;
    const createdAt = e.createdAt || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    
    await query(
      `INSERT INTO enquiries (id, name, phone, email, eventType, eventTitle, date, budget, message, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        e.name,
        e.phone,
        e.email || '',
        eventType,
        eventTitle,
        e.date || new Date().toISOString().split('T')[0],
        e.budget || '',
        e.message || '',
        'Pending',
        createdAt
      ]
    );
    res.json({ success: true, enquiry: { ...e, id, status: 'Pending', createdAt } });
  } catch (err) {
    console.error('Error saving enquiry:', err);
    res.status(500).json({ error: 'Failed to submit enquiry' });
  }
});

app.patch('/api/enquiries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await query('UPDATE enquiries SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, id, status });
  } catch (err) {
    console.error('Error updating enquiry status:', err);
    res.status(500).json({ error: 'Failed to update enquiry status' });
  }
});

app.delete('/api/enquiries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM enquiries WHERE id = ?', [id]);
    res.json({ success: true, id });
  } catch (err) {
    console.error('Error deleting enquiry:', err);
    res.status(500).json({ error: 'Failed to delete enquiry' });
  }
});

// 5. Orders API (From WhatsApp Order Form)
app.get('/api/orders', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM orders ORDER BY created_timestamp DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await query('SELECT * FROM orders WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching order by ID:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { id, customerName, phone, address, totalAmount, items, date, invoiceUrl } = req.body;
    const orderId = id || `MSC-${Date.now().toString().slice(-6)}`;
    await query(
      `INSERT INTO orders (id, customerName, phone, address, totalAmount, items, date, status, invoiceUrl)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'New', ?)`,
      [
        orderId,
        customerName,
        phone,
        address || '',
        totalAmount || 0,
        JSON.stringify(items || []),
        date || new Date().toLocaleDateString('en-IN'),
        invoiceUrl || ''
      ]
    );

    // Also auto add/update customer entry in customers table
    try {
      await query(
        `INSERT INTO customers (id, name, phone, city, district, totalOrders, totalSpent, type, lastOrder)
         VALUES (?, ?, ?, ?, 'Tenkasi', 1, ?, 'Regular', ?)
         ON DUPLICATE KEY UPDATE 
           name = VALUES(name),
           totalOrders = totalOrders + 1,
           totalSpent = totalSpent + VALUES(totalSpent),
           lastOrder = VALUES(lastOrder)`,
        [
          `CUST-${Date.now().toString().slice(-6)}`,
          customerName,
          phone,
          (address || '').split(',').pop()?.trim() || 'Tenkasi',
          totalAmount || 0,
          new Date().toLocaleDateString('en-IN')
        ]
      );
    } catch (e) {
      console.warn('Customer upsert note:', e.message);
    }

    res.json({ success: true, orderId });
  } catch (err) {
    console.error('Error saving order:', err);
    res.status(500).json({ error: 'Failed to record order' });
  }
});

app.patch('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, id, status });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM orders WHERE id = ?', [id]);
    res.json({ success: true, id });
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// 6. Customers API
app.get('/api/customers', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM customers ORDER BY totalSpent DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// 7. Reviews API
app.get('/api/reviews', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM reviews ORDER BY created_timestamp DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Static files for uploads & public assets
app.use(express.static(path.join(__dirname, 'public')));

// Static files for production serving
const DIST_DIR = path.join(__dirname, 'dist');
app.use(express.static(DIST_DIR));

// SPA catch-all fallback
app.use((req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// Export app for Vercel Serverless Functions
export default app;

// Start Server locally if not running on Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n🎇 Madhu Sri Crackers Backend API Server running at http://localhost:${PORT}`);
    console.log(`📊 Connected to TiDB Cloud Database: ${process.env.DB_NAME} (${process.env.DB_HOST})\n`);
  });
}
