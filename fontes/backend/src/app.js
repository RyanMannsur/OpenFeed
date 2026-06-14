import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import apiRouter from './routes/index.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';

dotenv.config();

const app = express();

// Middleware para habilitar CORS (Cross-Origin Resource Sharing)
// Essencial para permitir que o frontend Angular (normalmente na porta 4200) consuma esta API
app.use(cors({
  origin: '*', // Em produção, mude para o domínio real do seu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares para parsing de requisições com dados em JSON ou URL encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Expõe a pasta pública para servir imagens e outros ativos estáticos do backend.
app.use('/img', express.static(path.join(process.cwd(), 'public', 'img')));

// Servir arquivos estáticos do frontend Angular (versão cliente)
const frontendStaticPath = path.join(process.cwd(), 'fontes', 'frontend', 'dist', 'frontend', 'browser');
app.use(express.static(frontendStaticPath));

// Acopla todas as rotas da API sob o prefixo '/api'
app.use('/api', apiRouter);

// Rota de informação da API (movida de '/' para evitar colisão com o frontend)
app.get('/api-info', (req, res) => {
  res.json({
    name: 'OpenFeed API',
    version: '1.0.0',
    description: 'API oficial da plataforma OpenFeed',
    endpoints: {
      status: '/api/health',
      artigos: '/api/artigos',
      auth: '/api/auth',
      usuarios: '/api/usuarios'
    }
  });
});

// Qualquer outra rota não-API deve servir o index CSR do Angular (SPA)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/img')) {
    return next();
  }
  res.sendFile(path.join(frontendStaticPath, 'index.csr.html'));
});

// Middleware para tratamento de rotas não encontradas (404)
app.use(notFound);

// Middleware para tratamento de erros globais (500)
app.use(errorHandler);

export default app;
