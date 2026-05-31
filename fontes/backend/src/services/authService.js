import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import * as usuarioRepository from '../repositories/usuarioRepository.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_super_segura_do_openfeed_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

function gerarToken(id, nome, email) {
  return jwt.sign({ id, nome, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export async function registrar({ nome, email, senha, bio, avatarUrl }) {
  if (!nome || !email || !senha) {
    const err = new Error('Por favor, preencha todos os campos obrigatórios (nome, e-mail e senha).');
    err.statusCode = 400;
    throw err;
  }

  const usuarioExistente = await usuarioRepository.findByEmail(email);
  if (usuarioExistente) {
    const err = new Error('Este endereço de e-mail já está sendo utilizado.');
    err.statusCode = 400;
    throw err;
  }

  const salt = await bcrypt.genSalt(10);
  const senhaHash = await bcrypt.hash(senha, salt);

  const usuarioId = await usuarioRepository.create({ nome, email, senha: senhaHash, bio, avatarUrl });
  const novoUsuario = await usuarioRepository.findById(usuarioId);
  const token = gerarToken(novoUsuario.id, novoUsuario.nome, novoUsuario.email);

  return { usuario: novoUsuario, token };
}

export async function login({ email, senha }) {
  if (!email || !senha) {
    const err = new Error('Por favor, informe o e-mail e a senha.');
    err.statusCode = 400;
    throw err;
  }

  const usuario = await usuarioRepository.findByEmail(email);

  if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
    const err = new Error('E-mail ou senha incorretos.');
    err.statusCode = 401;
    throw err;
  }

  const { senha: _, ...dadosUsuario } = usuario;
  const token = gerarToken(usuario.id, usuario.nome, usuario.email);

  return { usuario: dadosUsuario, token };
}
