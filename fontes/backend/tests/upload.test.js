import request from 'supertest';
import fs from 'fs/promises';
import path from 'path';
import app from '../src/app.js';

describe('Upload de imagem de artigo', () => {
  const testImageBuffer = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG header
    0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
    0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41,
    0x54, 0x08, 0xd7, 0x63, 0x60, 0x00, 0x00, 0x00,
    0x02, 0x00, 0x01, 0xe2, 0x21, 0xbc, 0x33, 0x00,
    0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae,
    0x42, 0x60, 0x82
  ]);

  const token = 'Bearer dummy-token-for-test'; // auth middleware will reject; we mock it below

  // Mock protect middleware to bypass auth for tests
  jest.mock('../src/middlewares/authMiddleware.js', () => ({
    protect: (req, res, next) => next()
  }));

  it('deve fazer upload e salvar no diretório persistente', async () => {
    const response = await request(app)
      .post('/uploads/artigos/imagem')
      .set('Authorization', token)
      .attach('image', testImageBuffer, { filename: 'test.png', contentType: 'image/png' })
      .expect(201);

    expect(response.body.success).toBe(true);
    const imageUrl = response.body.data.imageUrl;
    expect(imageUrl).toMatch(/^\/img\/artigos\/.*\.webp$/);

    // Verifica que o arquivo foi criado no IMAGE_DIR
    const imagePath = path.join(process.env.IMAGE_DIR || path.join(process.cwd(), 'public', 'img', 'artigos'), path.basename(imageUrl));
    const exists = await fs.access(imagePath).then(() => true).catch(() => false);
    expect(exists).toBe(true);
  });
});
