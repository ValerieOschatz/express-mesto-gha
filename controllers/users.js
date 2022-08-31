const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');

const {
  OK,
  CREATED,
} = require('../utils/errorCodes');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const secretKey = crypto.randomBytes(32).toString('hex');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(OK).send({ users });
  } catch (err) {
    next(err);
    return null;
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }
    return res.status(OK).send({ user });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return null;
    }
    next(err);
    return null;
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }
    return res.status(OK).send({ user });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return null;
    }
    next(err);
    return null;
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;

    const hash = await bcrypt.hash(password, 10);

    // eslint-disable-next-line no-unused-vars
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });

    const visibleUser = {
      name,
      about,
      avatar,
      email,
    };

    return res.status(CREATED).send({ visibleUser });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(`Переданы некорректные данные${err.errors.name ? err.errors.name : ''}${err.errors.about ? err.errors.about : ''}${err.errors.avatar ? err.errors.avatar : ''}${err.errors.email ? err.errors.email : ''}`));
      return null;
    }
    if (err.code === 11000) {
      next(new ConflictError('Пользователь с этим email уже существует'));
      return null;
    }
    next(err);
    return null;
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }
    return res.status(OK).send({ user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(`Переданы некорректные данные${err.errors.name ? err.errors.name : ''}${err.errors.about ? err.errors.about : ''}`));
      return null;
    }
    next(err);
    return null;
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }
    return res.status(OK).send({ user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(`Переданы некорректные данные${err.errors.avatar ? err.errors.avatar : ''}`));
      return null;
    }
    next(err);
    return null;
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      secretKey,
      { expiresIn: '7d' },
    );
    return res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 * 24 * 7 }).status(OK).send({ token });
  } catch (err) {
    next(new UnauthorizedError('Указан неверный логин или пароль'));
    return null;
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
  secretKey,
};
