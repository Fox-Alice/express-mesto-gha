const Card = require('../models/Card');

const getCards = (async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch {
    res.status(500).send({ message: 'Ошибка сервера' });
  }
});

const createCard = (async (req, res) => {
  try {
    const newCard = await new Card(req.body);
    res.status(201).send(await newCard.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Ошибка валидации' });
    } else {
      res.status(500).send({ message: 'Ошибка сервера' });
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
      res.status(400).send({ message: 'Невалидный id карточки' });
    } else if (err.message === 'not found') {
      res.status(404).send({ message: 'Карточка не найдена' });
    } else {
      res.status(500).send({ message: 'Ошибка сервера' });
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
      res.status(400).send({ message: 'Невалидный id карточки' });
    } else if (err.message === 'not found') {
      res.status(404).send({ message: 'Карточка не найдена' });
    } else {
      res.status(500).send({ message: 'Ошибка сервера' });
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
      res.status(400).send({ message: 'Невалидный id карточки' });
    } else if (err.message === 'not found') {
      res.status(404).send({ message: 'Карточка не найдена' });
    } else {
      res.status(500).send({ message: 'Ошибка сервера' });
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
