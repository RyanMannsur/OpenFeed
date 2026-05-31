import pool from '../config/database.js';

class ArticleModel {
  // Cria um novo artigo
  static async create({ title, content, summary, category, rating = 0, imageUrl, authorId }) {
    const query = `
      INSERT INTO articles (title, content, summary, category, rating, image_url, author_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [title, content, summary, category, rating, imageUrl, authorId]);
    return result.insertId;
  }

  // Busca artigos com filtros dinâmicos (pesquisa, categoria, rating, paginação)
  static async findAll({ search, category, minRating, limit = 10, offset = 0 }) {
    let query = `
      SELECT a.*, u.name as author_name, u.avatar_url as author_avatar
      FROM articles a
      INNER JOIN users u ON a.author_id = u.id
      WHERE 1=1
    `;
    const queryParams = [];

    // Filtro por termo de busca (no título, resumo ou conteúdo)
    if (search) {
      query += ` AND (a.title LIKE ? OR a.summary LIKE ? OR a.content LIKE ?)`;
      const searchWildcard = `%${search}%`;
      queryParams.push(searchWildcard, searchWildcard, searchWildcard);
    }

    // Filtro por categoria
    if (category && category !== 'Todos' && category !== 'Todas') {
      query += ` AND a.category = ?`;
      queryParams.push(category);
    }

    // Filtro por avaliação mínima
    if (minRating !== undefined && minRating !== null) {
      query += ` AND a.rating >= ?`;
      queryParams.push(minRating);
    }

    // Ordenação (mais recentes primeiro)
    query += ` ORDER BY a.created_at DESC`;

    // Limite e Offset para Paginação
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit, 10), parseInt(offset, 10));

    const [rows] = await pool.query(query, queryParams);
    return rows;
  }

  // Conta o total de artigos para paginação baseado nos filtros fornecidos
  static async countAll({ search, category, minRating }) {
    let query = `
      SELECT COUNT(*) as total 
      FROM articles a
      WHERE 1=1
    `;
    const queryParams = [];

    if (search) {
      query += ` AND (a.title LIKE ? OR a.summary LIKE ? OR a.content LIKE ?)`;
      const searchWildcard = `%${search}%`;
      queryParams.push(searchWildcard, searchWildcard, searchWildcard);
    }

    if (category && category !== 'Todos' && category !== 'Todas') {
      query += ` AND a.category = ?`;
      queryParams.push(category);
    }

    if (minRating !== undefined && minRating !== null) {
      query += ` AND a.rating >= ?`;
      queryParams.push(minRating);
    }

    const [rows] = await pool.query(query, queryParams);
    return rows[0].total;
  }

  // Busca um artigo detalhado pelo ID
  static async findById(id) {
    const query = `
      SELECT a.*, u.name as author_name, u.avatar_url as author_avatar, u.bio as author_bio
      FROM articles a
      INNER JOIN users u ON a.author_id = u.id
      WHERE a.id = ?
    `;
    const [rows] = await pool.query(query, [id]);
    return rows[0] || null;
  }

  // Busca todos os artigos de um determinado autor
  static async findByAuthorId(authorId) {
    const query = `
      SELECT a.*, u.name as author_name, u.avatar_url as author_avatar
      FROM articles a
      INNER JOIN users u ON a.author_id = u.id
      WHERE a.author_id = ?
      ORDER BY a.created_at DESC
    `;
    const [rows] = await pool.query(query, [authorId]);
    return rows;
  }

  // Atualiza um artigo
  static async update(id, { title, content, summary, category, rating, imageUrl }) {
    const query = `
      UPDATE articles 
      SET title = ?, content = ?, summary = ?, category = ?, rating = ?, image_url = ?
      WHERE id = ?
    `;
    const [result] = await pool.query(query, [title, content, summary, category, rating, imageUrl, id]);
    return result.affectedRows > 0;
  }

  // Deleta um artigo
  static async delete(id) {
    const query = 'DELETE FROM articles WHERE id = ?';
    const [result] = await pool.query(query, [id]);
    return result.affectedRows > 0;
  }
}

export default ArticleModel;
