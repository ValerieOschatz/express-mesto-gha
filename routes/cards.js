const express = require('express');

const cardsRoutes = express.Router();

const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
} = require('../controllers/cards');

cardsRoutes.get('/', express.json(), getCards);
cardsRoutes.post('/', express.json(), createCard);
cardsRoutes.delete('/:cardId', express.json(), deleteCard);
cardsRoutes.put('/:cardId/likes', express.json(), addLike);
cardsRoutes.delete('/:cardId/likes', express.json(), removeLike);

module.exports = cardsRoutes;
