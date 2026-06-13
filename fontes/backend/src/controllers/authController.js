import * as authService from '../services/authService.js';

class AuthController {
  static async register(req, res, next) {
    try {
      const { nome, email, senha, bio, avatarUrl } = req.body;
      const resultado = await authService.registrar({ nome, email, senha, bio, avatarUrl });
      res.status(201).json({ success: true, message: 'Usuário registrado com sucesso!', data: resultado });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, senha } = req.body;
      const resultado = await authService.login({ email, senha });
      res.json({ success: true, message: 'Login realizado com sucesso!', data: resultado });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
