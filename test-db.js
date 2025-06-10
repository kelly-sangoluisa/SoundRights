const { pool } = require('./database.js');

async function testConnection() {
  try {
    const res = await pool.query('SELECT 1 AS test');
    console.log('Conexión exitosa:', res.rows);
  } catch (err) {
    console.error('Error al conectar:', err);
  } finally {
    await pool.end();
  }
}

testConnection();