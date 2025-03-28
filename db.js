require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Render DB URL
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
