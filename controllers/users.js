const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const User = require('../models/User');

const generateToken = require('../utils/jwt');

const {
  NotFoundError,
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} = require('../errors');

const {
  OK,
  CREATED,
  SALT_ROUNDS,
} = require('../constants');

const getUsers = (async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(OK).send(users);
  } catch (err) {
    next(err);
  }
});

const getUser = (async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    } else {
      res.status(OK).send(user);
    }
  } catch (err) {
    next(err);
  }
});

const getUserById = (async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    } else {
      res.status(OK).send(user);
    }
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Невалидный id'));
    } else {
      next(err);
    }
  }
});

const createUser = (async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError('Не передан email или password');
    }
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.findOne({ email });
    if (user) {
      throw new ConflictError('Пользователь уже существует');
    }
    const newUser = await new User({ email, password: hash });
    await newUser.save();
    res.status(CREATED).send({ email: newUser.email, _id: newUser._id });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Ошибка валидации'));
    } else { next(err); }
  }
}
);

const updateProfile = (async (req, res, next) => {
  try {
    const user = await User
      .findByIdAndUpdate(req.user._id, {
        name: req.body.name,
        about: req.body.about,
      }, { new: true, runValidators: true });
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    } else {
      res.status(OK).send(user);
    }
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError(`${err.message}`));
    } else { next(err); }
  }
}
);

const updateAvatar = (async (req, res, next) => {
  try {
    const user = await User
      .findByIdAndUpdate(
        req.user._id,
        { avatar: req.body.avatar },
        { new: true, runValidators: true },
      );
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    } else {
      res.status(OK).send(user);
    }
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError(`${err.message}`));
    } else { next(err); }
  }
});

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      next(new BadRequestError('Неправильный логин или пароль'));
    }
    const user = await User.findOne({ email }).select('+ password');
    if (!user) {
      next(new UnauthorizedError('Неправильный логин или пароль'));
    }
    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      next(new UnauthorizedError('Неправильный логин или пароль'));
    }
    const token = generateToken({ _id: user._id });
    res.status(OK).send({ message: 'Welcome!', token });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  getUserById,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
