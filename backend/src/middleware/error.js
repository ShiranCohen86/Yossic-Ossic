const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message, details: err.details });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: 'שגיאת ולידציה', details: err.message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'כתובת האימייל כבר קיימת במערכת' });
  }
  logger.error('Unhandled error', { error: err.message, stack: err.stack, url: req.url });
  res.status(500).json({ message: 'שגיאת שרת פנימית' });
};

module.exports = errorHandler;
