const mongoose = require('mongoose');

const Card = require('../models/Card');

const {
  OK,
  CREATED,
  BAD_REQUEST_ERR,
  NOT_FOUND_ERR,
  INTERNAL_SERVER_ERR,
} = require('../constants');

const getCards = (async (req, res) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    res.status(OK).send(cards);
  } catch (err) {
    res.status(INTERNAL_SERVER_ERR).send({ message: 'Ошибка сервера' });
  }
});

const createCard = (async (req, res) => {
  try {
    const { name, link } = req.body;
    const newCard = await Card.create({ name, link, owner: req.owner._id });
    res.status(CREATED).send(await newCard.save());
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(BAD_REQUEST_ERR).send({ message: 'Ошибка валидации' });
    } else {
      res.status(INTERNAL_SERVER_ERR).send({ message: 'Ошибка сервера' });
    }
  }
});

const deleteCard = (async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndRemove(cardId);
    if (!card) {
      throw new Error('not found');
    } else {
      const cards = await Card.find({});
      res.status(OK).send(cards);
    }
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      res.status(BAD_REQUEST_ERR).send({ message: 'Невалидный id карточки' });
    } else if (err.message === 'not found') {
      res.status(NOT_FOUND_ERR).send({ message: 'Карточка не найдена' });
    } else {
      res.status(INTERNAL_SERVER_ERR).send({ message: 'Ошибка сервера' });
    }
  }
});

const updateLike = (async (req, res, method) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { [method]: { likes: req.owner._id } },
      { new: true },
    );
    if (!card) {
      throw new Error('not found');
    } else {
      res.status(OK).send(card);
      return;
    }
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      res.status(BAD_REQUEST_ERR).send({ message: 'Невалидный id карточки' });
    } else if (err.message === 'not found') {
      res.status(NOT_FOUND_ERR).send({ message: 'Карточка не найдена' });
    } else {
      res.status(INTERNAL_SERVER_ERR).send({ message: 'Ошибка сервера' });
    }
  }
});

const likeCard = async (req, res) => updateLike(req, res, '$addToSet');

const deleteLikeCard = (req, res) => updateLike(req, res, '$pull');

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  deleteLikeCard,
};
