import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';

const ARTICLE_IMAGE_DIR = path.join(process.cwd(), 'public', 'img', 'artigos');

export async function uploadArticleImage(req, res, next) {
  try {
    if (!req.file) {
      const error = new Error('Envie uma imagem válida para continuar.');
      error.statusCode = 400;
      throw error;
    }

    await fs.mkdir(ARTICLE_IMAGE_DIR, { recursive: true });

    const fileName = `${Date.now()}-${crypto.randomUUID()}.webp`;
    const filePath = path.join(ARTICLE_IMAGE_DIR, fileName);

    await sharp(req.file.buffer)
      .rotate()
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(filePath);

    res.status(201).json({
      success: true,
      message: 'Imagem enviada com sucesso.',
      data: {
        imageUrl: `/img/artigos/${fileName}`
      }
    });
  } catch (error) {
    next(error);
  }
}