import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { categories, allProducts, testimonials } from '../src/data/products.js';

dotenv.config();

const initialEnquiries = [
  {
    id: 'ENQ-101',
    name: 'Senthil Velan',
    phone: '9842156789',
    email: 'senthil@gmail.com',
    eventType: 'marriage',
    eventTitle: 'Wedding Reception Pyro Show',
    date: '2026-11-28',
    budget: '35,000',
    message: 'Need 25-shots sky shots (10 boxes), flower pots deluxe (15 boxes), and 10,000 wala sound crackers for reception entrance.',
    status: 'Pending',
    createdAt: 'Today, 10:30 AM'
  },
  {
    id: 'ENQ-102',
    name: 'Murugan Temple Committee',
    phone: '9789012345',
    email: 'templetrust@gmail.com',
    eventType: 'temple',
    eventTitle: 'Panguni Uthiram Thiruvizha',
    date: '2026-12-05',
    budget: '75,000',
    message: 'Aerial night show requirement with multi-colour fountains and display shells for 45 minutes.',
    status: 'Contacted',
    createdAt: 'Yesterday, 04:15 PM'
  },
  {
    id: 'ENQ-103',
    name: 'Anand & Co (Corporate)',
    phone: '9443109876',
    email: 'events@anandinfra.in',
    eventType: 'corporate',
    eventTitle: 'New Year Corporate Gala 2027',
    date: '2026-12-31',
    budget: '1,20,000',
    message: 'Silent pyro musical display, stage fountains, and 100 family gift hampers for employee gifting.',
    status: 'Confirmed',
    createdAt: '16 Nov 2026'
  }
];

const initialCustomers = [
  {
    id: 'CUST-001',
    name: 'Senthil Velan',
    phone: '9842156789',
    city: 'Tenkasi',
    district: 'Tenkasi',
    totalOrders: 3,
    totalSpent: 14500,
    type: 'VIP Customer',
    lastOrder: '18 Nov 2026'
  },
  {
    id: 'CUST-002',
    name: 'Murugan Temple Trust',
    phone: '9789012345',
    city: 'Veerasigamani',
    district: 'Tenkasi',
    totalOrders: 5,
    totalSpent: 52000,
    type: 'Wholesale VIP',
    lastOrder: '17 Nov 2026'
  },
  {
    id: 'CUST-003',
    name: 'Kavitha Ramesh',
    phone: '9442187654',
    city: 'Tirunelveli',
    district: 'Tirunelveli',
    totalOrders: 2,
    totalSpent: 4800,
    type: 'Regular',
    lastOrder: '16 Nov 2026'
  },
  {
    id: 'CUST-004',
    name: 'Vikram',
    phone: '9894567890',
    city: 'Madurai',
    district: 'Madurai',
    totalOrders: 1,
    totalSpent: 2150,
    type: 'Regular',
    lastOrder: '15 Nov 2026'
  },
  {
    id: 'CUST-005',
    name: 'Selvam Agencies',
    phone: '9443211223',
    city: 'Rajapalayam',
    district: 'Virudhunagar',
    totalOrders: 4,
    totalSpent: 89000,
    type: 'Wholesale VIP',
    lastOrder: '12 Nov 2026'
  }
];

async function initDatabase() {
  console.log('Connecting to TiDB Cloud Database: madhusri...');
  
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

  try {
    const conn = await pool.getConnection();
    console.log('✅ Connected to TiDB successfully!');

    // 1. Categories Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(500) DEFAULT '',
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table created/verified: categories');

    // 2. Products Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        categoryName VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        originalPrice DECIMAL(10,2) NOT NULL,
        discount VARCHAR(50) DEFAULT '',
        rating DECIMAL(3,1) DEFAULT 4.8,
        reviews VARCHAR(50) DEFAULT '1',
        image VARCHAR(500) DEFAULT '',
        description TEXT,
        inStock BOOLEAN DEFAULT TRUE,
        isBestSeller BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table created/verified: products');

    // 3. Enquiries Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        eventType VARCHAR(100),
        eventTitle VARCHAR(255),
        date VARCHAR(50),
        budget VARCHAR(100),
        message TEXT,
        status VARCHAR(50) DEFAULT 'Pending',
        createdAt VARCHAR(100),
        created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table created/verified: enquiries');

    // 4. Orders Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(100) PRIMARY KEY,
        customerName VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        address TEXT,
        totalAmount DECIMAL(10,2) NOT NULL,
        items JSON,
        date VARCHAR(50),
        status VARCHAR(50) DEFAULT 'New',
        invoiceUrl TEXT,
        created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table created/verified: orders');

    // 5. Reviews Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        city VARCHAR(100),
        rating INT DEFAULT 5,
        comment TEXT NOT NULL,
        date VARCHAR(50),
        status VARCHAR(50) DEFAULT 'Published',
        created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table created/verified: reviews');

    // 6. Customers Table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL UNIQUE,
        city VARCHAR(100),
        district VARCHAR(100),
        totalOrders INT DEFAULT 1,
        totalSpent DECIMAL(10,2) DEFAULT 0,
        type VARCHAR(50) DEFAULT 'Regular',
        lastOrder VARCHAR(50),
        created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table created/verified: customers');

    // ================= SEEDING DATA IF EMPTY =================
    // 1. Seed Categories
    const [catCount] = await conn.query('SELECT COUNT(*) as count FROM categories');
    if (catCount[0].count === 0) {
      console.log('Seeding categories into TiDB...');
      for (const cat of categories) {
        if (cat.id === 'all') continue;
        await conn.query(
          'INSERT INTO categories (id, name, image, description) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name)',
          [cat.id, cat.name, cat.image || '', '']
        );
      }
      console.log(`✓ Seeded ${categories.length - 1} categories`);
    } else {
      console.log(`Categories table already contains ${catCount[0].count} categories`);
    }

    // 2. Seed Products
    const [prodCount] = await conn.query('SELECT COUNT(*) as count FROM products');
    if (prodCount[0].count === 0) {
      console.log('Seeding products into TiDB...');
      for (const p of allProducts) {
        await conn.query(
          `INSERT INTO products 
           (id, name, category, categoryName, price, originalPrice, discount, rating, reviews, image, description, inStock, isBestSeller)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE name=VALUES(name)`,
          [
            p.id,
            p.name,
            p.category,
            p.categoryName || 'Crackers',
            p.price,
            p.originalPrice || p.price,
            p.discount || '',
            p.rating || 4.8,
            p.reviews || '100',
            p.image || '',
            p.description || '',
            p.inStock !== false,
            !!p.isBestSeller
          ]
        );
      }
      console.log(`✓ Seeded ${allProducts.length} products`);
    } else {
      console.log(`Products table already contains ${prodCount[0].count} products`);
    }

    // 3. Enquiries Table verified (Real enquiries created by users)
    // 4. Reviews Table verified (Created by real customers)
    // 5. Customers Table verified (Auto-created when users place orders)

    conn.release();
    console.log('\n🎉 Database Schema and Seeding Completed Successfully on TiDB Cloud!');
    await pool.end();
  } catch (err) {
    console.error('Database initialization error:', err);
    process.exit(1);
  }
}

initDatabase();

