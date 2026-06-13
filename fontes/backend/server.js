import app from './src/app.js';
import { testConnection } from './src/config/database.js';
import { initDatabase } from './src/config/initDatabase.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function aguardarBanco({ tentativas = 15, intervaloMs = 3000 } = {}) {
  for (let tentativa = 1; tentativa <= tentativas; tentativa += 1) {
    const conectou = await testConnection();

    if (conectou) {
      return true;
    }

    if (tentativa < tentativas) {
      console.log(`⏳ Aguardando MySQL ficar disponível... tentativa ${tentativa}/${tentativas}`);
      await new Promise((resolve) => setTimeout(resolve, intervaloMs));
    }
  }

  return false;
}

async function startServer() {
  console.log('🔄 Inicializando servidor OpenFeed...');

  const isDbConnected = await aguardarBanco();

  if (!isDbConnected) {
    console.warn('⚠️ Conexão com o banco falhou. Os endpoints que utilizam o banco de dados falharão até o MySQL estar acessível.');
  } else {
    // Aplica o schema automaticamente (cria tabelas se não existirem)
    await initDatabase();
  }

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando no modo: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Acesso local: http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  });
}

startServer();
