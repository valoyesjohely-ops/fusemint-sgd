import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function initializeDatabase() {
  try {
    // First connection without database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: parseInt(process.env.DB_PORT || '3306'),
    });

    console.log('✅ Connected to MySQL');

    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'fusemint_sgd'}`);
    console.log('✅ Database created or already exists');

    // Select database
    await connection.changeUser({ database: process.env.DB_NAME || 'fusemint_sgd' });

    // Read and execute schema
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    const statements = schema.split(';').filter(s => s.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }
    console.log('✅ Schema created successfully');

    // Read and execute initial data
    const dataPath = path.join(__dirname, '../database/initial-data.sql');
    const initialData = fs.readFileSync(dataPath, 'utf-8');
    const dataStatements = initialData.split(';').filter(s => s.trim());

    for (const statement of dataStatements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }
    console.log('✅ Initial data loaded successfully');

    await connection.end();
    console.log('✅ Database initialization completed!');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}

export default initializeDatabase;
