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

  // Remove comentários de linha (-- ...) ANTES de dividir por ";"
  // Isso evita que comentários no início sejam confundidos com statements
  const cleanSql = sql
    .split('\n')
    .map((line) => line.replace(/--.*$/, ''))
    .join('\n');

  // Divide em statements individuais, ignorando os vazios
  const statements = cleanSql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const conn = await pool.getConnection();
  try {
    for (const statement of statements) {
      await conn.query(statement);
    }
    console.log(`✅ Banco de dados inicializado com sucesso (${statements.length} statements aplicados).`);
  } catch (err) {
    if (err.code !== 'ER_TABLE_EXISTS_ERROR' && err.code !== 'ER_DUP_ENTRY') {
      console.error('[DB Init] Erro ao aplicar schema:', err.message);
    } else {
      console.log('[DB Init] Tabelas já existem, nenhuma alteração necessária.');
    }
  } finally {
    conn.release();
  }
}
