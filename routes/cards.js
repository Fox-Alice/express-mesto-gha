const express = require('express');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLikeCard,
} = require('../controllers/cards');

const { validateCardInfo, validateObjectCardId } = require('../middlewares/validation');

const cardRouter = express.Router();

cardRouter.get('/', getCards);
cardRouter.post('/', validateCardInfo, createCard);
cardRouter.delete('/:cardId', validateObjectCardId, deleteCard);
cardRouter.put('/:cardId/likes', validateObjectCardId, likeCard);
cardRouter.delete('/:cardId/likes', validateObjectCardId, deleteLikeCard);

module.exports = cardRouter;
