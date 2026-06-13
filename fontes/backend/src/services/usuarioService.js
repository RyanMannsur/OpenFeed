import * as usuarioRepository from '../repositories/usuarioRepository.js';
import * as artigoRepository from '../repositories/artigoRepository.js';

export async function getPerfil(id) {
  const usuario = await usuarioRepository.findById(id);
  if (!usuario) {
    const err = new Error('Usuário não encontrado.');
    err.statusCode = 404;
    throw err;
  }
  return usuario;
}

export async function getPerfilPublico(id) {
  const usuario = await usuarioRepository.findById(id);
  if (!usuario) {
    const err = new Error('Usuário não encontrado.');
    err.statusCode = 404;
    throw err;
  }
  return usuario;
}

export async function updatePerfil(id, { nome, bio, avatarUrl }) {
  if (!nome) {
    const err = new Error('O nome é um campo obrigatório.');
    err.statusCode = 400;
    throw err;
  }

  const atualizado = await usuarioRepository.update(id, { nome, bio, avatarUrl });
  if (!atualizado) {
    const err = new Error('Não foi possível atualizar o perfil. Usuário não encontrado.');
    err.statusCode = 404;
    throw err;
  }

  return await usuarioRepository.findById(id);
}

export async function getArtigosDoUsuario(autorId) {
  return await artigoRepository.findByAutorId(autorId);
}
