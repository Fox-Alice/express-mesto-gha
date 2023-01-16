const mongoose = require('mongoose');

const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'Введен неверный формат электронной почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    minlength: [2, 'Минимальное количество символов 2'],
    maxlength: [30, 'Максимальное количество символов 30'],
    type: String,
    default: 'Жак-Ив Кусто',
  },
  about: {
    minlength: [2, 'Минимальное количество символов 2'],
    maxlength: [30, 'Максимальное количество символов 30'],
    type: String,
    default: 'Исследователь',
  },
  avatar: {
    validate: {
      validator(val) {
        return validator.isURL(val);
      },
      message: 'Необходимо ввести корректную ссылку на изображение',
    },
    type: String,
    // required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});
module.exports = mongoose.model('user', userSchema);
