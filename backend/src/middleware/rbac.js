const ApiError = require('../utils/ApiError');

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, 'אין לך הרשאה לבצע פעולה זו'));
  }
  next();
};

module.exports = { authorize };
