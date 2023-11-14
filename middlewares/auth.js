const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
const { JWT_SECRET, NODE_ENV } = process.env;

module.exports = (req, res, next) => {
  let payload;
  try {
    const token = req.cookies.jwt;


    if (!token) {
      throw new UnauthorizedError('NotAuthenticated')
    }

    const validToken = token.replace('Bearer ', '');

    payload = jwt.verify(validToken, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (error) {

    if (error.name === 'JsonWebTokenError') {
      return next(new UnauthorizedError('С токеном что-то не так'));
    }
    return next(error);
  }

  req.user = payload;
  return next();
}