const Card = require('../models/card');

const { CREATED } = require('../utils/statusCodes')

const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const CastError = require('../errors/cast-err');
const ForbiddenError = require('../errors/forbidden-error');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (error) {
    return next(error);
  }
};

const createCard = async (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  try {
    const newCard = await new Card({ name, link, owner });
    return res.status(CREATED).send(await newCard.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new ValidationError('Ошибка валидации полей'))
    }

    return next(error);
  }
};

const deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  try {

    const card = await Card.findById(cardId).orFail(new NotFoundError('Такой карточки не существует'));

    if (userId !== card.owner.toString()) {
      throw new ForbiddenError('Нельзя удалить чужую карточку')
    }

    await Card.deleteOne(card);

    return res.send(card);

  } catch (error) {
    if (error.name === 'CastError') {
      return next(new CastError('Передан невалидный id'));
    }
    return next(error);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Карточка по id  не найдена')
    }
    return res.send(card);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new CastError('Передан невалидный id'));
    }
    return next(error);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )

    if (!card) {
      throw new NotFoundError('Карточка по id  не найдена')
    }
    return res.send(card);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new CastError('Передан невалидный id'));
    }
    return next(error);
  }
};

module.exports = {
  createCard,
  deleteCard,
  getCards,
  likeCard,
  dislikeCard,
};
