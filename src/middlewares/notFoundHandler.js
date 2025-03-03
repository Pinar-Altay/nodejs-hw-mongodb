// Adım 2-3

import createError from 'http-errors';

const notFoundHandler = (req, res, next) => {
  // 404 hatası fırlat
  next(createError(404, 'Route not found'));
};

export default notFoundHandler;
