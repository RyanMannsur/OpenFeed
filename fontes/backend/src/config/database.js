import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const isSSL = process.env.DB_SSL === 'true';

// Configura o pool de conexões
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'openfeed_db',
  // SSL obrigatório para provedores externos como Aiven
  ssl: isSSL ? { rejectUnauthorized: false } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000
};

console.log(`[DB] Conectando em ${dbConfig.host}:${dbConfig.port} (SSL: ${isSSL}) DB: ${dbConfig.database}`);

const pool = mysql.createPool(dbConfig);

// Função para testar a conexão com o banco
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexão com o banco de dados MySQL estabelecida com sucesso!');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados MySQL:');
    console.error('   Código:', error.code);
    console.error('   Mensagem:', error.message);
    console.error('   Host:', dbConfig.host, '| Porta:', dbConfig.port, '| User:', dbConfig.user, '| DB:', dbConfig.database);
    return false;
  }
}

export default pool;
