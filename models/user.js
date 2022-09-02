const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');
const { regex } = require('../utils/data');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'поле name должно содержать не менее 2 символов'],
    maxlength: [30, ', поле name должно содержать не более 30 символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'поле about должно содержать не менее 2 символов'],
    maxlength: [30, 'поле about должно содержать не более 30 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => regex.test(v),
      message: 'введите адрес ссылки',
    },
  },
  email: {
    type: String,
    required: [true, 'поле email обязательное'],
    unique: [true, 'пользователь с этим email уже существует'],
    validate: {
      validator: (v) => isEmail(v),
      message: 'введите корректный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = async function (email, password) {
  try {
    const user = await this.findOne({ email }).select('+password');
    if (!user) {
      return Promise.reject(new UnauthorizedError('Указан неверный логин или пароль'));
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return Promise.reject(new UnauthorizedError('Указан неверный логин или пароль'));
    }
    return user;
  } catch (err) {
    return err;
  }
};

module.exports = mongoose.model('user', userSchema);
