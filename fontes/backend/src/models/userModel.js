import pool from '../config/database.js';

class UserModel {
  // Cria um novo usuário
  static async create(name, email, hashedPassword, bio = null, avatarUrl = null) {
    const query = `
      INSERT INTO users (name, email, password, bio, avatar_url)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [name, email, hashedPassword, bio, avatarUrl]);
    return result.insertId;
  }

  // Busca um usuário pelo e-mail
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.query(query, [email]);
    return rows[0] || null;
  }

  // Busca um usuário pelo ID (retorna sem a senha por segurança)
  static async findById(id) {
    const query = 'SELECT id, name, email, bio, avatar_url, created_at, updated_at FROM users WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0] || null;
  }

  // Busca um usuário pelo ID com a senha (usado internamente em trocas de senha/autenticações específicas)
  static async findByIdWithPassword(id) {
    const query = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0] || null;
  }

  // Atualiza os dados do perfil do usuário
  static async update(id, { name, bio, avatarUrl }) {
    const query = `
      UPDATE users 
      SET name = ?, bio = ?, avatar_url = ?
      WHERE id = ?
    `;
    const [result] = await pool.query(query, [name, bio, avatarUrl, id]);
    return result.affectedRows > 0;
  }

  // Atualiza a senha de um usuário
  static async updatePassword(id, hashedPassword) {
    const query = 'UPDATE users SET password = ? WHERE id = ?';
    const [result] = await pool.query(query, [hashedPassword, id]);
    return result.affectedRows > 0;
  }
}

export default UserModel;
