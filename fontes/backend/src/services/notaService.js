import * as notaRepository from '../repositories/notaRepository.js';
import * as artigoRepository from '../repositories/artigoRepository.js';
import * as usuarioRepository from '../repositories/usuarioRepository.js';

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

  // Salva ou atualiza a avaliação do usuário
  await notaRepository.upsert({ usuarioId, artigoId, valor });

  // Recalcula a média do artigo e salva imediatamente
  const mediaArtigo = await notaRepository.calcularMediaDoArtigo(artigoId);
  await artigoRepository.updateMediaNotas(artigoId, mediaArtigo);

  // Recalcula a média do autor e salva imediatamente
  const autorId = artigo.authorId;
  const mediaAutor = await notaRepository.calcularMediaDoAutor(autorId);
  await usuarioRepository.updateMediaNota(autorId, mediaAutor);

  console.log(`[Nota] Artigo #${artigoId} → média: ${mediaArtigo} | Autor #${autorId} → média: ${mediaAutor}`);

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
    valor: parseFloat(artigo.rating ?? 0)
  };
}
