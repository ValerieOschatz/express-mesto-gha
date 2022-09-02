const express = require('express');

const cardsRoutes = express.Router();

const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
} = require('../controllers/cards');

const {
  validateCreateCard,
  validateCheckCard,
} = require('../middlewares/validators');

cardsRoutes.get('/', getCards);
cardsRoutes.post('/', validateCreateCard, createCard);
cardsRoutes.delete('/:cardId', validateCheckCard, deleteCard);
cardsRoutes.put('/:cardId/likes', validateCheckCard, addLike);
cardsRoutes.delete('/:cardId/likes', validateCheckCard, removeLike);

module.exports = cardsRoutes;
