import cron from 'node-cron';
import * as agendadorRepository from '../repositories/agendadorRepository.js';
import * as notaRepository from '../repositories/notaRepository.js';
import * as artigoRepository from '../repositories/artigoRepository.js';
import * as usuarioRepository from '../repositories/usuarioRepository.js';

export async function executarRecalculo() {
  const pendentes = await agendadorRepository.listarPendentes();

  if (pendentes.length === 0) {
    return;
  }

  const artigosUnicos = [...new Set(pendentes.map(p => p.artigo_id))];

  for (const artigoId of artigosUnicos) {
    const mediaArtigo = await notaRepository.calcularMediaDoArtigo(artigoId);
    await artigoRepository.updateMediaNotas(artigoId, mediaArtigo);

    const autorId = await artigoRepository.findAutorIdByArtigoId(artigoId);
    if (autorId) {
      const mediaAutor = await notaRepository.calcularMediaDoAutor(autorId);
      await usuarioRepository.updateMediaNota(autorId, mediaAutor);
    }
  }

  for (const registro of pendentes) {
    await agendadorRepository.marcarComoProcessado(registro.id);
  }

  console.log(`[Agendador] ${new Date().toISOString()} — Recálculo concluído. Artigos processados: ${artigosUnicos.length}`);
}

export function iniciarAgendador() {
  cron.schedule('*/10 * * * *', async () => {
    try {
      await executarRecalculo();
    } catch (error) {
      console.error('[Agendador] Erro durante o recálculo:', error.message);
    }
  });

  console.log('[Agendador] Job de recálculo de notas iniciado — execução a cada 10 minutos.');
}
