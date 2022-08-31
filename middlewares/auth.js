const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { secretKey } = require('../controllers/users');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  let payload;

  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
    return null;
  }

  req.user = payload;
  next();
  return null;
};
