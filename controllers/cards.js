const mongoose = require('mongoose');

const Card = require('../models/Card');

const {
  OK,
  CREATED,
} = require('../constants');
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require('../errors');

const getCards = (async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    res.status(OK).send(cards);
  } catch (err) {
    next(err);
  }
});

const createCard = (async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const newCard = await Card.create({ name, link, owner: req.user._id });
    res.status(CREATED).send(await newCard.save());
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError(`${err.message}`));
    } else { next(err); }
  }
});

const deleteCard = (async (req, res, next) => {
  try {
    if (req.owner !== req.user._id) {
      next(new ForbiddenError('Чужие карточки удалять нельзя!'));
    }
    const { cardId } = req.params;
    const card = await Card.findByIdAndRemove(cardId);
    if (!card) {
      next(new NotFoundError('Карточка не найдена'));
    } else {
      const cards = await Card.find({});
      res.status(OK).send(cards);
    }
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Невалидный id карточки'));
    } else { next(err); }
  }
});

const updateLike = (async (req, res, next, method) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { [method]: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      next(new NotFoundError('Карточка не найдена'));
    } else {
      res.status(OK).send(card);
      return;
    }
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Невалидный id карточки'));
    } else { next(err); }
  }
});

const likeCard = async (req, res, next) => updateLike(req, res, next, '$addToSet');

const deleteLikeCard = (req, res, next) => updateLike(req, res, next, '$pull');

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  deleteLikeCard,
};
