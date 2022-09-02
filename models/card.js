const mongoose = require('mongoose');
const { regex } = require('../utils/data');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'поле name обязательное'],
    minlength: [2, 'поле name должно содержать не менее 2 символов'],
    maxlength: [30, 'поле name должно содержать не более 30 символов'],
  },
  link: {
    type: String,
    required: [true, 'поле link обязательное'],
    validate: {
      validator: (v) => regex.test(v),
      message: 'введите адрес ссылки',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
