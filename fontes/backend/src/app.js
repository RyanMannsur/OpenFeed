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

// Rota raiz para verificação rápida do status do servidor
app.get('/', (req, res) => {
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

// Acopla todas as rotas da API sob o prefixo '/api'
app.use('/api', apiRouter);

// Middleware para tratamento de rotas não encontradas (404)
app.use(notFound);

// Middleware para tratamento de erros globais (500)
app.use(errorHandler);

export default app;
