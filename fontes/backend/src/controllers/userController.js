import * as usuarioService from '../services/usuarioService.js';

class UserController {
  static async getProfile(req, res, next) {
    try {
      const usuario = await usuarioService.getPerfil(req.user.id);
      res.json({ success: true, data: usuario });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const { nome, bio, avatarUrl } = req.body;
      const usuario = await usuarioService.updatePerfil(req.user.id, { nome, bio, avatarUrl });
      res.json({ success: true, message: 'Perfil atualizado com sucesso!', data: usuario });
    } catch (error) {
      next(error);
    }
  }

  static async getUserArticles(req, res, next) {
    try {
      const artigos = await usuarioService.getArtigosDoUsuario(req.user.id);
      res.json({ success: true, data: artigos });
    } catch (error) {
      next(error);
    }
  }

  static async getPublicProfile(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const usuario = await usuarioService.getPerfilPublico(id);
      res.json({ success: true, data: usuario });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
