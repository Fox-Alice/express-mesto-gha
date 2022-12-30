const router = require('express').Router();

const userRouter = require('./users');
const cardRouter = require('./cards');

const { NOT_FOUND_ERR } = require('../constants');

router.use('/users', userRouter);

router.use('/cards', cardRouter);

router.use('/*', ((req, res) => {
  res.status(NOT_FOUND_ERR).send({ message: 'Страница не найдена' });
}));

module.exports = router;
