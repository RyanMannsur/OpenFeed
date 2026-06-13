import * as notaRepository from '../repositories/notaRepository.js';
import * as agendadorRepository from '../repositories/agendadorRepository.js';
import * as artigoRepository from '../repositories/artigoRepository.js';
import { executarRecalculo } from '../jobs/recalculoJob.js';

export async function darNota({ usuarioId, artigoId, valor }) {
  if (!valor || valor < 1 || valor > 5) {
    const err = new Error('A nota deve ser um valor entre 1 e 5.');
    err.statusCode = 400;
    throw err;
  }

  const artigo = await artigoRepository.findById(artigoId);
  if (!artigo) {
    const err = new Error('Artigo não encontrado.');
    err.statusCode = 404;
    throw err;
  }

  const notaId = await notaRepository.upsert({ usuarioId, artigoId, valor });
  await agendadorRepository.registrar({ notaId, artigoId });

  // Dispara o recálculo imediato de forma assíncrona
  setImmediate(async () => {
    try {
      await executarRecalculo();
    } catch (err) {
      console.error('[Background Recalculate] Erro ao recalcular notas:', err.message);
    }
  });

  return { mensagem: 'Nota registrada com sucesso. A média foi atualizada.' };
}

export async function getNota({ usuarioId, artigoId }) {
  const artigo = await artigoRepository.findById(artigoId);
  if (!artigo) {
    const err = new Error('Artigo não encontrado.');
    err.statusCode = 404;
    throw err;
  }

  const notaDoUsuario = await notaRepository.findByUsuarioEArtigo(usuarioId, artigoId);

  if (notaDoUsuario) {
    return {
      tipo: 'propria',
      valor: parseFloat(notaDoUsuario.valor)
    };
  }

  return {
    tipo: 'media',
    valor: parseFloat(artigo.media_notas)
  };
}
