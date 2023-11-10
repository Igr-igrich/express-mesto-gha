const jwt = require('jsonwebtoken');
const { JWT_SECRET, NODE_ENV } = process.env;

module.exports = (req, res, next) => {
  let payload;
  try {
    const token = req.cookies.jwt;


    if (!token) {
      throw new Error('NotAuthenticated')
    }

    const validToken = token.replace('Bearer ', '');

    payload = jwt.verify(validToken, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (error) {
    if (error.message === 'NotAuthenticated') {
      return res.status(401).send({ message: 'Неправильные email или password' });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send({ message: 'С токеном что-то не так' });
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка' });
  }

  req.user = payload;
  return next();
}