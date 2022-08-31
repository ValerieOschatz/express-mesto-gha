const Card = require('../models/card');
const {
  OK,
  CREATED,
} = require('../utils/errorCodes');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.status(OK).send({ cards });
  } catch (err) {
    next(err);
    return null;
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    return res.status(CREATED).send({ card });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError(`Переданы некорректные данные${err.errors.name ? err.errors.name : ''}${err.errors.link ? err.errors.link : ''}`));
      return null;
    }
    next(err);
    return null;
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    }
    if (card.owner.toString() === req.user._id) {
      card.remove();
      return res.status(OK).send({ message: 'Карточка удалена' });
    }
    throw new ForbiddenError('Нельзя удалить чужую карточку');
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return null;
    }
    next(err);
    return null;
  }
};

const addLike = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    }
    return res.status(OK).send({ card });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return null;
    }
    next(err);
    return null;
  }
};

const removeLike = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    }
    return res.status(OK).send({ card });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return null;
    }
    next(err);
    return null;
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  removeLike,
};
