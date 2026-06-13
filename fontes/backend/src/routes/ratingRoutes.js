import express from 'express';
import RatingController from '../controllers/ratingController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/:id/nota')
  .get(protect, RatingController.getNota)
  .post(protect, RatingController.darNota);

export default router;