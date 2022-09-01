const express = require('express');

const usersRoutes = express.Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUser,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

usersRoutes.get('/', getUsers);
usersRoutes.get('/me', getCurrentUser);

usersRoutes.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUser);

usersRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

usersRoutes.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/https?:\/\/(www\.)?[\w-.]+\.[a-z]{2,3}[\w-.~:/?#[\]@!$&'()*+,;=]*#?/),
  }),
}), updateAvatar);

module.exports = usersRoutes;
