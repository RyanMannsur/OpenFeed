import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_super_segura_do_openfeed_2026';

export function protect(req, res, next) {
  let token;

  // Verifica se o token foi passado no cabeçalho Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Se não houver token, retorna erro
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Não autorizado. Token de autenticação ausente ou inválido.'
    });
  }

  try {
    // Verifica e decodifica o token JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Anexa as informações do usuário decodificado à requisição
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token de autenticação inválido ou expirado.'
    });
  }
}
