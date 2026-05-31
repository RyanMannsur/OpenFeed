import * as notaRepository from '../repositories/notaRepository.js';
import * as agendadorRepository from '../repositories/agendadorRepository.js';
import * as artigoRepository from '../repositories/artigoRepository.js';

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

  return { mensagem: 'Nota registrada com sucesso. A média será atualizada em breve.' };
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
