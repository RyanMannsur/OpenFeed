import express from 'express';
import UserController from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/perfil')
  .get(UserController.getProfile)
  .put(UserController.updateProfile);

router.get('/artigos', UserController.getUserArticles);

router.get('/:id', UserController.getPublicProfile);

export default router;
