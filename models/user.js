const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, ', поле name обязательное'],
    minlength: [2, ', поле name должно содержать не менее 2 символов'],
    maxlength: [30, ', поле name должно содержать не более 30 символов'],
  },
  about: {
    type: String,
    required: [true, ', поле about обязательное'],
    minlength: [2, ', поле about должно содержать не менее 2 символов'],
    maxlength: [30, ', поле name должно содержать не более 30 символов'],
  },
  avatar: {
    type: String,
    required: [true, ', поле avatar обязательное'],
  },
});

module.exports = mongoose.model('user', userSchema);
