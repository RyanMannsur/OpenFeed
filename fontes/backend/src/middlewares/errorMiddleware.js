export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Ocorreu um erro interno no servidor.',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

export function notFound(req, res, next) {
  const error = new Error(`Rota não encontrada — ${req.originalUrl}`);
  res.status(404);
  next(error);
}
