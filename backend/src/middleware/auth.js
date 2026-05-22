const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new ApiError(401, 'אין הרשאה — נדרשת כניסה למערכת');
    }
    const token = header.split(' ')[1];
    const payload = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(payload.sub).select('-passwordHash');
    if (!user || !user.isActive) {
      throw new ApiError(401, 'המשתמש לא קיים או אינו פעיל');
    }
    req.user = user;
    next();
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    next(new ApiError(401, 'טוקן לא תקף או פג תוקף'));
  }
};

module.exports = { authenticate };
