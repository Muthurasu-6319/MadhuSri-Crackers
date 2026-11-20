import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function verifyAll() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
  });

  try {
    const conn = await pool.getConnection();
    console.log('--- TiDB Cloud Database Audit ---');
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log(`Host: ${process.env.DB_HOST}`);

    const tables = ['categories', 'products', 'enquiries', 'orders', 'reviews', 'customers'];
    for (const t of tables) {
      const [rows] = await conn.query(`SELECT COUNT(*) as count FROM ${t}`);
      console.log(`Table "${t}": ${rows[0].count} rows`);
    }

    const [sampleCats] = await conn.query('SELECT id, name FROM categories LIMIT 5');
    console.log('\nSample Categories in TiDB:', sampleCats);

    const [sampleProds] = await conn.query('SELECT id, name, price FROM products LIMIT 3');
    console.log('\nSample Products in TiDB:', sampleProds);

    conn.release();
    await pool.end();
    console.log('\n✅ All TiDB Cloud tables verified and operational!');
  } catch (err) {
    console.error('Audit error:', err);
    process.exit(1);
  }
}

verifyAll();

