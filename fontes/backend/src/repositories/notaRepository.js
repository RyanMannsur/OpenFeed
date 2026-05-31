import pool from '../config/database.js';

export async function upsert({ usuarioId, artigoId, valor }) {
  const [result] = await pool.query(
    `INSERT INTO notas (usuario_id, artigo_id, valor)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE valor = VALUES(valor), atualizado_em = CURRENT_TIMESTAMP`,
    [usuarioId, artigoId, valor]
  );
  const isInsert = result.insertId > 0;
  const notaId = isInsert ? result.insertId : await findIdByUsuarioEArtigo(usuarioId, artigoId);
  return notaId;
}

async function findIdByUsuarioEArtigo(usuarioId, artigoId) {
  const [rows] = await pool.query(
    'SELECT id FROM notas WHERE usuario_id = ? AND artigo_id = ?',
    [usuarioId, artigoId]
  );
  return rows[0]?.id || null;
}

export async function findByUsuarioEArtigo(usuarioId, artigoId) {
  const [rows] = await pool.query(
    'SELECT * FROM notas WHERE usuario_id = ? AND artigo_id = ?',
    [usuarioId, artigoId]
  );
  return rows[0] || null;
}

export async function calcularMediaDoArtigo(artigoId) {
  const [rows] = await pool.query(
    'SELECT AVG(valor) AS media FROM notas WHERE artigo_id = ?',
    [artigoId]
  );
  return parseFloat(rows[0]?.media || 0);
}

export async function calcularMediaDoAutor(autorId) {
  const [rows] = await pool.query(
    'SELECT AVG(a.media_notas) AS media FROM artigos a WHERE a.autor_id = ?',
    [autorId]
  );
  return parseFloat(rows[0]?.media || 0);
}
