const router = require('express').Router();

const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const { validateRegisterBody, validateLoginBody } = require('../middlewares/validation');

const { createUser, login } = require('../controllers/users');
const { NotFoundError } = require('../errors');

router.use('/signin', validateLoginBody, login);

router.use('/signup', validateRegisterBody, createUser);

router.use('/users', auth, userRouter);

router.use('/cards', auth, cardRouter);

router.use('/*', auth, ((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
}));

module.exports = router;
