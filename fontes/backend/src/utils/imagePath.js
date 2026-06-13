const REMOTE_IMAGE_PATTERN = /^https?:\/\//i;

export function normalizarCaminhoImagem(valor) {
  if (!valor) {
    return null;
  }

  const texto = String(valor).trim();

  if (!texto) {
    return null;
  }

  if (REMOTE_IMAGE_PATTERN.test(texto) || texto.startsWith('data:')) {
    return texto;
  }

  if (texto.startsWith('/')) {
    return texto;
  }

  return `/img/artigos/${texto}`;
}

export function extrairNomeImagem(caminho) {
  if (!caminho) {
    return null;
  }

  return String(caminho).split('/').filter(Boolean).pop() || null;
}