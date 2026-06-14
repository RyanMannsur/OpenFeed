import * as artigoService from '../services/artigoService.js';

class ArticleController {
  static async getArticles(req, res, next) {
    try {
      const { search, categoria, minNota, maxNota, startDate, endDate, page = 1, limit = 10 } = req.query;
      const resultado = await artigoService.listar({ search, categoria, minNota, maxNota, startDate, endDate, page, limit });
      res.json({ success: true, data: resultado });
    } catch (error) {
      next(error);
    }
  }

  static async getArticleById(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const artigo = await artigoService.buscarPorId(id);
      res.json({ success: true, data: artigo });
    } catch (error) {
      next(error);
    }
  }

  static async createArticle(req, res, next) {
    try {
      const { titulo, conteudo, resumo, categoria, imageUrl } = req.body;
      const artigo = await artigoService.criar({ titulo, conteudo, resumo, categoria, imageUrl }, req.user.id);
      res.status(201).json({ success: true, message: 'Artigo publicado com sucesso!', data: artigo });
    } catch (error) {
      next(error);
    }
  }

  static async updateArticle(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const { titulo, conteudo } = req.body;
      const artigo = await artigoService.atualizar(id, { titulo, conteudo }, req.user.id);
      res.json({ success: true, message: 'Artigo atualizado com sucesso!', data: artigo });
    } catch (error) {
      next(error);
    }
  }

  static async deleteArticle(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      await artigoService.deletar(id, req.user.id);
      res.json({ success: true, message: 'Artigo excluído com sucesso!' });
    } catch (error) {
      next(error);
    }
  }
}

export default ArticleController;
