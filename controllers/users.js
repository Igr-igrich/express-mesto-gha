const User = require('../models/user');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(new Error('NotFound'));
    return res.send(user);
  } catch (error) {
    if (error.message === 'NotFound') {
      return res.status(404).send({ message: 'Пользователь по id  не найден' });
    }
    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Передан невалидный id' });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = await new User(req.body);
    return res.status(201).send(await newUser.save());
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res
        .status(400)
        .send({ message: 'Ошибка валидации полей', ...error });
    }

    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

const updateUser = async (req, res) => {
  const owner = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(
      owner,
      { name: req.body.name, about: req.body.about },
      {
        new: true,
        runValidators: true,
      },
    );
    return res.send(user);
  } catch (error) {
    if (error.message === 'NotFound') {
      return res.status(404).send({ message: 'Пользователь c указанным id не найден' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    const owner = req.user._id;
    const user = await User.findByIdAndUpdate(
      owner,
      { avatar: req.body.avatar },
      {
        new: true,
        runValidators: true,
      },
    );
    return res.send(user);
  } catch (error) {
    if (error.message === 'NotFound') {
      return res.status(404).send({ message: 'Пользователь c указанным id не найден' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
};
