const jwt = require('jsonwebtoken');
const { UnauthorizedError, ForbiddenError } = require('../errors');

const { JWT_SECRET_KEY, NODE_ENV } = process.env;

const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET_KEY : 'dev_secret');
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      next(new ForbiddenError('Нет доступа'));
    } else {
      next(err);
    }
  }
  req.user = payload;
  next();
};

module.exports = auth;
