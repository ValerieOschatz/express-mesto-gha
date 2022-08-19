const Card = require('../models/card');
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  OK,
  CREATED,
} = require('../utils/errorCodes');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(OK).send({ cards });
  } catch (err) {
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    return res.status(CREATED).send({ card });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
};

const deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if (!card) {
      return res.status(NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' });
    }
    return res.status(OK).send({ card });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
};

const addLike = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return res.status(NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' });
    }
    return res.status(OK).send({ card });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
};

const removeLike = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return res.status(NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' });
    }
    return res.status(OK).send({ card });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
};
