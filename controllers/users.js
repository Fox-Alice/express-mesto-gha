const User = require('../models/User');

const getUsers = (async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch {
    res.status(500).send({ message: 'Ошибка сервера' });
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
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Невалидный id' });
    } else if (err.message === 'not found') {
      res.status(404).send({ message: 'Пользователь не найден' });
    } else {
      res.status(500).send({ message: 'Ошибка сервера' });
    }
  }
});

const createUser = (async (req, res) => {
  try {
    const newUser = await new User(req.body);
    res.status(201).send(await newUser.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Ошибка валидации' });
    } else {
      res.status(500).send({ message: 'Ошибка сервера' });
    }
  }
});

const updateProfile = (async (req, res) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(req.owner._id, { name, about }, { new: true });
    if (!name || !about) {
      throw new Error('empty field');
    } else if (!user) {
      throw new Error('not found');
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    if (err.message === 'empty field') {
      res.status(400).send({ message: 'Поле не должно быть пустым' });
    } else if (err.message === 'not found') {
      res.status(404).send({ message: 'Пользователь не найден' });
    } else {
      res.status(500).send({ message: 'Ошибка сервера' });
    }
  }
});

const updateAvatar = (async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.owner._id, { avatar }, { new: true });
    if (!avatar) {
      throw new Error('empty field');
    } else if (!user) {
      throw new Error('not found');
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    if (err.message === 'empty field') {
      res.status(400).send({ message: 'Поле не должно быть пустым' });
    } else if (err.message === 'not found') {
      res.status(404).send({ message: 'Пользователь не найден' });
    } else {
      res.status(500).send({ message: 'Ошибка сервера' });
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