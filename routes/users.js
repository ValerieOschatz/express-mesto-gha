const express = require('express');

const usersRoutes = express.Router();

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

usersRoutes.get('/', express.json(), getUsers);
usersRoutes.get('/:userId', express.json(), getUser);
usersRoutes.post('/', express.json(), createUser);
usersRoutes.patch('/me', express.json(), updateUser);
usersRoutes.patch('/me/avatar', express.json(), updateAvatar);

module.exports = usersRoutes;
