const Card = require('../models/Card');

const {
  BAD_REQUEST_ERR,
  NOT_FOUND_ERR,
  INTERNAL_SERVER_ERR,
} = require('../constants');

const getCards = (async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    res.status(INTERNAL_SERVER_ERR).send({ message: 'Ошибка сервера' });
  }
});

const createCard = (async (req, res) => {
  try {
    const { name, link } = req.body;
    const newCard = await new Card({ name, link, owner: req.owner._id });
    Card.populate(newCard, {
      path: 'user',
      select: 'name about avatar',
    });
    res.status(201).send(await newCard.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
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
      res.status(200).send(cards);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERR).send({ message: 'Невалидный id карточки' });
    } else if (err.message === 'not found') {
      res.status(NOT_FOUND_ERR).send({ message: 'Карточка не найдена' });
    } else {
      res.status(INTERNAL_SERVER_ERR).send({ message: 'Ошибка сервера' });
    }
  }
});

const likeCard = (async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.owner._id } },
      { new: true },
    );
    if (!card) {
      throw new Error('not found');
    } else {
      res.status(200).send(card);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERR).send({ message: 'Невалидный id карточки' });
    } else if (err.message === 'not found') {
      res.status(NOT_FOUND_ERR).send({ message: 'Карточка не найдена' });
    } else {
      res.status(INTERNAL_SERVER_ERR).send({ message: 'Ошибка сервера' });
    }
  }
});

const deleteLikeCard = (async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.owner._id } },
      { new: true },
    );
    if (!card) {
      throw new Error('not found');
    } else {
      res.status(200).send(card);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERR).send({ message: 'Невалидный id карточки' });
    } else if (err.message === 'not found') {
      res.status(NOT_FOUND_ERR).send({ message: 'Карточка не найдена' });
    } else {
      res.status(INTERNAL_SERVER_ERR).send({ message: 'Ошибка сервера' });
    }
  }
});

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  deleteLikeCard,
};
