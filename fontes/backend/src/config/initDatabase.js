import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Executa o schema.sql para garantir que as tabelas existam.
 * Seguro para rodar múltiplas vezes (usa CREATE TABLE IF NOT EXISTS).
 */
export async function initDatabase() {
  const schemaPath = join(__dirname, '../../schema.sql');

  let sql;
  try {
    sql = readFileSync(schemaPath, 'utf8');
  } catch (err) {
    console.warn('[DB Init] schema.sql não encontrado, pulando inicialização automática.');
    return;
  }

  // Divide o SQL em statements individuais (separados por ;)
  const statements = sql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'));

  const conn = await pool.getConnection();
  try {
    for (const statement of statements) {
      await conn.query(statement);
    }
    console.log('✅ Banco de dados inicializado com sucesso (schema aplicado).');
  } catch (err) {
    // Ignora erros de "já existe" — schema usa IF NOT EXISTS e ON DUPLICATE KEY
    if (err.code !== 'ER_TABLE_EXISTS_ERROR' && err.code !== 'ER_DUP_ENTRY') {
      console.error('[DB Init] Erro ao aplicar schema:', err.message);
    }
  } finally {
    conn.release();
  }
}
