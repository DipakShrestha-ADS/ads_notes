import logger from '../config/logger.js';

export function errorHandler(err, req, res, next) {
  logger.error('Request failed', {
    method: req.method,
    url: req.originalUrl,
    message: err.message,
    stack: err.stack,
  });
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({
    message: err.status ? err.message : 'An unexpected server error occurred',
  });
}
