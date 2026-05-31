import * as artigoRepository from '../repositories/artigoRepository.js';
import { normalizarCaminhoImagem } from '../utils/imagePath.js';

export async function listar({ search, categoria, minNota, page = 1, limit = 10 }) {
  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);
  const offset = (parsedPage - 1) * parsedLimit;
  const minNotaVal = minNota ? parseFloat(minNota) : undefined;

  const [artigos, total] = await Promise.all([
    artigoRepository.findAll({ search, categoria, minNota: minNotaVal, limit: parsedLimit, offset }),
    artigoRepository.countAll({ search, categoria, minNota: minNotaVal })
  ]);

  return {
    artigos,
    paginacao: {
      totalArtigos: total,
      totalPaginas: Math.ceil(total / parsedLimit),
      paginaAtual: parsedPage,
      limite: parsedLimit
    }
  };
}

export async function buscarPorId(id) {
  const artigo = await artigoRepository.findById(id);
  if (!artigo) {
    const err = new Error('Artigo não encontrado.');
    err.statusCode = 404;
    throw err;
  }
  return artigo;
}

export async function criar({ titulo, conteudo, resumo, categoria, imageUrl }, autorId) {
  if (!titulo || !conteudo || !categoria) {
    const err = new Error('Por favor, preencha os campos obrigatórios (título, conteúdo e categoria).');
    err.statusCode = 400;
    throw err;
  }

  const artigoId = await artigoRepository.create({
    titulo,
    conteudo,
    resumo,
    categoria,
    imageUrl: normalizarCaminhoImagem(imageUrl),
    autorId
  });
  return await artigoRepository.findById(artigoId);
}

export async function atualizar(id, { titulo, conteudo, resumo, categoria, imageUrl }, usuarioId) {
  const artigo = await artigoRepository.findById(id);
  if (!artigo) {
    const err = new Error('Artigo não encontrado.');
    err.statusCode = 404;
    throw err;
  }

  if (artigo.autor_id !== usuarioId) {
    const err = new Error('Acesso negado. Você não tem permissão para editar este artigo.');
    err.statusCode = 403;
    throw err;
  }

  await artigoRepository.update(id, {
    titulo: titulo || artigo.titulo,
    conteudo: conteudo || artigo.conteudo,
    resumo: resumo !== undefined ? resumo : artigo.resumo,
    categoria: categoria || artigo.categoria,
    imageUrl: imageUrl !== undefined ? normalizarCaminhoImagem(imageUrl) : artigo.image_url
  });

  return await artigoRepository.findById(id);
}

export async function deletar(id, usuarioId) {
  const artigo = await artigoRepository.findById(id);
  if (!artigo) {
    const err = new Error('Artigo não encontrado.');
    err.statusCode = 404;
    throw err;
  }

  if (artigo.autor_id !== usuarioId) {
    const err = new Error('Acesso negado. Você não tem permissão para excluir este artigo.');
    err.statusCode = 403;
    throw err;
  }

  await artigoRepository.deleteById(id);
}
