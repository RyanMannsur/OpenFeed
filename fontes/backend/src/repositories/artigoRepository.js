import pool from '../config/database.js';

function mapArtigo(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    title: row.titulo,
    content: row.conteudo,
    summary: row.resumo,
    category: row.categoria,
    rating: Number(row.media_notas ?? 0),
    imageUrl: row.imageUrl ?? row.image_url ?? null,
    authorId: row.autor_id,
    author: row.autor_nome,
    authorAvatar: row.autor_avatar,
    authorBio: row.autor_bio,
    date: row.criado_em,
    updatedAt: row.atualizado_em
  };
}

export async function create({ titulo, conteudo, resumo, categoria, imageUrl, autorId }) {
  const [result] = await pool.query(
    'INSERT INTO artigos (titulo, conteudo, resumo, categoria, image_url, autor_id) VALUES (?, ?, ?, ?, ?, ?)',
    [titulo, conteudo, resumo, categoria, imageUrl, autorId]
  );
  return result.insertId;
}

export async function findAll({ search, categoria, minNota, limit = 10, offset = 0 }) {
  let query = `
    SELECT a.*, u.nome AS autor_nome, u.avatar_url AS autor_avatar
    FROM artigos a
    INNER JOIN usuarios u ON a.autor_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    query += ' AND (a.titulo LIKE ? OR a.resumo LIKE ? OR a.conteudo LIKE ?)';
    const w = `%${search}%`;
    params.push(w, w, w);
  }

  if (categoria && categoria !== 'Todos' && categoria !== 'Todas') {
    query += ' AND a.categoria = ?';
    params.push(categoria);
  }

  if (minNota !== undefined && minNota !== null) {
    query += ' AND a.media_notas >= ?';
    params.push(minNota);
  }

  query += ' ORDER BY a.criado_em DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit, 10), parseInt(offset, 10));

  const [rows] = await pool.query(query, params);
  return rows.map(mapArtigo);
}

export async function countAll({ search, categoria, minNota }) {
  let query = 'SELECT COUNT(*) AS total FROM artigos a WHERE 1=1';
  const params = [];

  if (search) {
    query += ' AND (a.titulo LIKE ? OR a.resumo LIKE ? OR a.conteudo LIKE ?)';
    const w = `%${search}%`;
    params.push(w, w, w);
  }

  if (categoria && categoria !== 'Todos' && categoria !== 'Todas') {
    query += ' AND a.categoria = ?';
    params.push(categoria);
  }

  if (minNota !== undefined && minNota !== null) {
    query += ' AND a.media_notas >= ?';
    params.push(minNota);
  }

  const [rows] = await pool.query(query, params);
  return rows[0].total;
}

export async function findById(id) {
  const query = `
    SELECT a.*, u.nome AS autor_nome, u.avatar_url AS autor_avatar, u.bio AS autor_bio
    FROM artigos a
    INNER JOIN usuarios u ON a.autor_id = u.id
    WHERE a.id = ?
  `;
  const [rows] = await pool.query(query, [id]);
  return mapArtigo(rows[0]);
}

export async function findByAutorId(autorId) {
  const query = `
    SELECT a.*, u.nome AS autor_nome, u.avatar_url AS autor_avatar
    FROM artigos a
    INNER JOIN usuarios u ON a.autor_id = u.id
    WHERE a.autor_id = ?
    ORDER BY a.criado_em DESC
  `;
  const [rows] = await pool.query(query, [autorId]);
  return rows.map(mapArtigo);
}

export async function update(id, { titulo, conteudo, resumo, categoria, imageUrl }) {
  const [result] = await pool.query(
    'UPDATE artigos SET titulo = ?, conteudo = ?, resumo = ?, categoria = ?, image_url = ? WHERE id = ?',
    [titulo, conteudo, resumo, categoria, imageUrl, id]
  );
  return result.affectedRows > 0;
}

export async function deleteById(id) {
  const [result] = await pool.query('DELETE FROM artigos WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

export async function updateMediaNotas(id, media) {
  const [result] = await pool.query(
    'UPDATE artigos SET media_notas = ? WHERE id = ?',
    [media, id]
  );
  return result.affectedRows > 0;
}

export async function findAutorIdByArtigoId(artigoId) {
  const [rows] = await pool.query('SELECT autor_id FROM artigos WHERE id = ?', [artigoId]);
  return rows[0]?.autor_id || null;
}
