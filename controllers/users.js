const mongoose = require('mongoose');

const User = require('../models/User');

const {
  BAD_REQUEST_ERR,
  NOT_FOUND_ERR,
  INTERNAL_SERVER_ERR,
} = require('../constants');

const getUsers = (async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(INTERNAL_SERVER_ERR).send({ message: 'Ошибка сервера' });
  }
});

const getUserById = (async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      throw new Error('not found');
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      res.status(BAD_REQUEST_ERR).send({ message: 'Невалидный id' });
    } else if (err.message === 'not found') {
      res.status(NOT_FOUND_ERR).send({ message: 'Пользователь не найден' });
    } else {
      res.status(INTERNAL_SERVER_ERR).send({ message: 'Ошибка сервера' });
    }
  }
});

const createUser = (async (req, res) => {
  try {
    const newUser = await new User(req.body);
    res.status(201).send(await newUser.save());
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(BAD_REQUEST_ERR).send({ message: 'Ошибка валидации' });
    } else {
      res.status(INTERNAL_SERVER_ERR).send({ message: 'Ошибка сервера' });
    }
  }
});

const updateProfile = (async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.owner._id, req.body, { new: true });
    if (!req.body.name || !req.body.about) {
      throw new Error('empty field');
    } else if (!user) {
      throw new Error('not found');
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    if (err.message === 'empty field') {
      res.status(BAD_REQUEST_ERR).send({ message: 'Поле не должно быть пустым' });
    } else if (err.message === 'not found') {
      res.status(NOT_FOUND_ERR).send({ message: 'Пользователь не найден' });
    } else {
      res.status(INTERNAL_SERVER_ERR).send({ message: 'Ошибка сервера' });
    }
  }
});

const updateAvatar = (async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.owner._id, req.body, { new: true });
    if (!req.body.avatar) {
      throw new Error('empty field');
    } else if (!user) {
      throw new Error('not found');
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    if (err.message === 'empty field') {
      res.status(BAD_REQUEST_ERR).send({ message: 'Поле не должно быть пустым' });
    } else if (err.message === 'not found') {
      res.status(NOT_FOUND_ERR).send({ message: 'Пользователь не найден' });
    } else {
      res.status(INTERNAL_SERVER_ERR).send({ message: 'Ошибка сервера' });
    }
  }
});

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
