import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function testConnection() {
  console.log('Testing connection to TiDB Cloud...');
  console.log(`Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
  console.log(`User: ${process.env.DB_USER}`);
  console.log(`Database: ${process.env.DB_NAME}`);

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 4000,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
      }
    });

    console.log('✅ Successfully connected to TiDB Cloud!');

    const [versionRows] = await connection.query('SELECT VERSION() as version, DATABASE() as db, NOW() as server_time');
    console.log('Database Info:', versionRows[0]);

    const [tableRows] = await connection.query('SHOW TABLES');
    console.log('Existing tables in database:', tableRows);

    await connection.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    if (error.code) console.error('Error code:', error.code);
  }
}

testConnection();

