import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import articleRoutes from './articleRoutes.js';
import ratingRoutes from './ratingRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    message: 'OpenFeed API está funcionando perfeitamente!',
    timestamp: new Date()
  });
});

router.use('/auth', authRoutes);
router.use('/usuarios', userRoutes);
router.use('/artigos', articleRoutes);
router.use('/artigos', ratingRoutes);
router.use('/uploads', uploadRoutes);

export default router;
