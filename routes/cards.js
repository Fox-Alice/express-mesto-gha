const express = require('express');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLikeCard,
} = require('../controllers/cards');

const { validateCardInfo, validateObjectId } = require('../middlewares/validation');

const cardRouter = express.Router();

cardRouter.get('/', getCards);
cardRouter.post('/', validateCardInfo, createCard);
cardRouter.delete('/:id', validateObjectId, deleteCard);
cardRouter.put('/:id/likes', validateObjectId, likeCard);
cardRouter.delete('/:id/likes', validateObjectId, deleteLikeCard);

module.exports = cardRouter;
