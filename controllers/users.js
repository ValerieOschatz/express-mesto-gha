const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  OK,
  CREATED,
} = require('../utils/errorCodes');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(OK).send({ users });
  } catch (err) {
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
    }
    return res.status(OK).send({ user });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
    }
    return res.status(OK).send({ user });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
};

const createUser = async (req, res) => {
  try {
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });

    return res.status(CREATED).send({ user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST).send({ message: `Переданы некорректные данные${err.errors.name ? err.errors.name : ''}${err.errors.about ? err.errors.about : ''}${err.errors.avatar ? err.errors.avatar : ''}${err.errors.email ? err.errors.email : ''}` });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
    }
    return res.status(OK).send({ user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST).send({ message: `Переданы некорректные данные${err.errors.name ? err.errors.name : ''}${err.errors.about ? err.errors.about : ''}` });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
    }
    return res.status(OK).send({ user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST).send({ message: `Переданы некорректные данные${err.errors.avatar ? err.errors.avatar : ''}` });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      'some-secret-key',
      { expiresIn: '7d' },
    );
    return res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 * 24 * 7 }).status(OK).send({ token });
  } catch (err) {
    return res.status(401).send({ message: 'Указан неверный логин или пароль' });
  }
};

module.exports = {
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
