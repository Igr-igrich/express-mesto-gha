const Card = require('../models/card');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (error) {
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

const createCard = async (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  try {
    const newCard = await new Card({ name, link, owner });

    return res.status(201).send(newCard);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res
        .status(400)
        .send({ message: 'Ошибка валидации полей', ...error });
    }

    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params.cardId;
    const card = await Card.findByIdAndRemove(cardId).orFail(new Error('NotFound'));
    return res.send(card);
  } catch (error) {
    if (error.message === 'NotFound') {
      return res.status(404).send({ message: 'Карточка по id  не найдена' });
    }
    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Передан невалидный id' });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

const likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    return res.send(card);
  } catch (error) {
    if (error.message === 'NotFound') {
      return res.status(404).send({ message: 'Карточка по id  не найдена' });
    }
    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Передан невалидный id' });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    return res.send(card);
  } catch (error) {
    if (error.message === 'NotFound') {
      return res.status(404).send({ message: 'Карточка по id  не найдена' });
    }
    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Передан невалидный id' });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports = {
  createCard,
  deleteCard,
  getCards,
  likeCard,
  dislikeCard,
};
