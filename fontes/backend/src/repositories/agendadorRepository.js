import pool from '../config/database.js';

export async function registrar({ notaId, artigoId }) {
  const [result] = await pool.query(
    'INSERT INTO agendador_notas (nota_id, artigo_id) VALUES (?, ?)',
    [notaId, artigoId]
  );
  return result.insertId;
}

export async function listarPendentes() {
  const [rows] = await pool.query(
    'SELECT * FROM agendador_notas WHERE processado = 0'
  );
  return rows;
}

export async function marcarComoProcessado(id) {
  const [result] = await pool.query(
    'UPDATE agendador_notas SET processado = 1, processado_em = CURRENT_TIMESTAMP WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
}
