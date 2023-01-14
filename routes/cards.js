const express = require('express');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLikeCard,
} = require('../controllers/cards');

const { validateCardInfo } = require('../middlewares/validation');

const cardRouter = express.Router();

cardRouter.get('/', getCards);
cardRouter.post('/', validateCardInfo, createCard);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.put('/:cardId/likes', likeCard);
cardRouter.delete('/:cardId/likes', deleteLikeCard);

module.exports = cardRouter;
