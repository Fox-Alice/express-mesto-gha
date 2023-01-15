const mongoose = require('mongoose');

const linkValidator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    minlength: [2, 'Минимальное количество символов 2'],
    maxlength: [30, 'Максимальное количество символов 30'],
    type: String,
    required: true,
  },
  link: {
    validate: {
      validator(val) {
        return linkValidator.isURL(val);
      },
      message: 'Необходимо ввести корректную ссылку на изображение',
    },
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model('Card', cardSchema);
