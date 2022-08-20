const express = require('express');

const cardsRoutes = express.Router();

const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
} = require('../controllers/cards');

cardsRoutes.get('/', getCards);
cardsRoutes.post('/', createCard);
cardsRoutes.delete('/:cardId', deleteCard);
cardsRoutes.put('/:cardId/likes', addLike);
cardsRoutes.delete('/:cardId/likes', removeLike);

module.exports = cardsRoutes;
