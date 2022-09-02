const express = require('express');
const { errors } = require('celebrate');

const {
  createUser,
  login,
  logout,
} = require('../controllers/users');

const {
  validateSignUp,
  validateSignIn,
} = require('../middlewares/validators');

const routes = express.Router();
const usersRoutes = require('./users');
const cardsRoutes = require('./cards');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

routes.post('/signup', validateSignUp, createUser);
routes.post('/signin', validateSignIn, login);

routes.use(auth);

routes.use('/users', usersRoutes);
routes.use('/cards', cardsRoutes);
routes.get('/signout', logout);

routes.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

routes.use(errors());

// eslint-disable-next-line no-unused-vars
routes.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

module.exports = routes;
