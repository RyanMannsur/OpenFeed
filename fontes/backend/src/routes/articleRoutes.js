import express from 'express';
import ArticleController from '../controllers/articleController.js';
import multer from 'multer';
import { protect } from '../middlewares/authMiddleware.js';
import { uploadArticleImage } from '../controllers/uploadController.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter(req, file, cb) {
    const isImage = file.mimetype.startsWith('image/');

    if (!isImage) {
      cb(new Error('Somente arquivos de imagem são permitidos.'));
      return;
    }

    cb(null, true);
  }
});

router.route('/')
  .get(ArticleController.getArticles)
  .post(protect, ArticleController.createArticle);

router.route('/:id')
  .get(ArticleController.getArticleById)
  .put(protect, ArticleController.updateArticle)
  .delete(protect, ArticleController.deleteArticle);

router.post('/imagem', protect, upload.single('image'), uploadArticleImage);

export default router;
