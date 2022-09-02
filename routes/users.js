const express = require('express');

const usersRoutes = express.Router();

const {
  getUsers,
  getUser,
  getCurrentUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

const {
  validateGetUser,
  validateUpdateUser,
  validateUpdateAvatar,
} = require('../middlewares/validators');

usersRoutes.get('/', getUsers);
usersRoutes.get('/me', getCurrentUser);
usersRoutes.get('/:userId', validateGetUser, getUser);
usersRoutes.patch('/me', validateUpdateUser, updateUser);
usersRoutes.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = usersRoutes;
