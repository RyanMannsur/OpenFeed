import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configura o pool de conexões
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'openfeed_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Função para testar a conexão com o banco
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexão com o banco de dados MySQL estabelecida com sucesso!');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados MySQL:', error.message);
    console.error('Certifique-se de que o servidor MySQL está rodando e que as credenciais no arquivo .env estão corretas.');
    return false;
  }
}

export default pool;
