const mongoose = require('mongoose');

const { emailValidator, linkValidator } = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    validate: {
      validator(val) {
        return emailValidator.isEmail(val);
      },
      message: 'Необходимо ввести корректный адрес электронной почты',
    },
    type: String,
    required: true,
    unique: true,
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
        return linkValidator.isURL(val);
      },
      message: 'Необходимо ввести корректную ссылку на изображение',
    },
    type: String,
    required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});
module.exports = mongoose.model('user', userSchema);
