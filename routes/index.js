const router = require('express').Router();

const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const { validateRegisterBody } = require('../middlewares/validation');

const { NOT_FOUND_ERR } = require('../constants');
const { createUser, login } = require('../controllers/users');

router.use('/signin', validateRegisterBody, login);

router.use('/signup', validateRegisterBody, createUser);

router.use('/users', auth, userRouter);

router.use('/cards', auth, cardRouter);

router.use('/*', ((req, res) => {
  res.status(NOT_FOUND_ERR).send({ message: 'Страница не найдена' });
}));

module.exports = router;
