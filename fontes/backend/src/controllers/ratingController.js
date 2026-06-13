import * as ratingService from '../services/ratingService.js';

class RatingController {
  static async darNota(req, res, next) {
    try {
      const artigoId = parseInt(req.params.id, 10);
      const { valor } = req.body;
      const resultado = await ratingService.darNota({ usuarioId: req.user.id, artigoId, valor: parseFloat(valor) });
      res.status(201).json({ success: true, message: resultado.mensagem });
    } catch (error) {
      next(error);
    }
  }

  static async getNota(req, res, next) {
    try {
      const artigoId = parseInt(req.params.id, 10);
      const resultado = await ratingService.getNota({ usuarioId: req.user.id, artigoId });
      res.json({ success: true, data: resultado });
    } catch (error) {
      next(error);
    }
  }
}

export default RatingController;
