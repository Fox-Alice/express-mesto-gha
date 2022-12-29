const express = require('express');
const {
  getCards,
  createCard,
  deleteCard,
  likeCardController,
  deleteLikeCard,
} = require('../controllers/cards');

const cardRouter = express.Router();

cardRouter.get('/', getCards);
cardRouter.post('/', express.json(), createCard);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.put('/:cardId/likes', likeCardController);
cardRouter.delete('/:cardId/likes', deleteLikeCard);

module.exports = cardRouter;
