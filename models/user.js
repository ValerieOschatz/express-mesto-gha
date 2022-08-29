const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, ', поле name должно содержать не менее 2 символов'],
    maxlength: [30, ', поле name должно содержать не более 30 символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, ', поле about должно содержать не менее 2 символов'],
    maxlength: [30, ', поле about должно содержать не более 30 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: [true, ', поле email обязательное'],
    unique: [true, ', пользователь с этим email уже существует'],
    validate: {
      validator: (v) => isEmail(v),
      message: ', введите корректный email',
    },
  },
  password: {
    type: String,
    required: [true, ', поле password обязательное'],
  },
});

module.exports = mongoose.model('user', userSchema);
