import pool from '../config/database.js';

export async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  return rows[0] || null;
}

export async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, nome, email, bio, avatar_url, media_nota, criado_em, atualizado_em FROM usuarios WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

export async function create({ nome, email, senha, bio = null, avatarUrl = null }) {
  const [result] = await pool.query(
    'INSERT INTO usuarios (nome, email, senha, bio, avatar_url) VALUES (?, ?, ?, ?, ?)',
    [nome, email, senha, bio, avatarUrl]
  );
  return result.insertId;
}

export async function update(id, { nome, bio, avatarUrl }) {
  const [result] = await pool.query(
    'UPDATE usuarios SET nome = ?, bio = ?, avatar_url = ? WHERE id = ?',
    [nome, bio, avatarUrl, id]
  );
  return result.affectedRows > 0;
}

export async function updateSenha(id, senhaHash) {
  const [result] = await pool.query(
    'UPDATE usuarios SET senha = ? WHERE id = ?',
    [senhaHash, id]
  );
  return result.affectedRows > 0;
}

export async function updateMediaNota(id, media) {
  const [result] = await pool.query(
    'UPDATE usuarios SET media_nota = ? WHERE id = ?',
    [media, id]
  );
  return result.affectedRows > 0;
}
