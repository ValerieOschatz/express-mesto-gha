const express = require('express');

const usersRoutes = express.Router();

const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

usersRoutes.get('/', getUsers);
usersRoutes.get('/:userId', getUser);
usersRoutes.patch('/me', updateUser);
usersRoutes.patch('/me/avatar', updateAvatar);

module.exports = usersRoutes;
