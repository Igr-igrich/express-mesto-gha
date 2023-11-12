const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUNDS = 10;

const { SUCCESS, CREATED } = require('../utils/statusCodes')

const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const CastError = require('../errors/cast-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-err');

const createUser = async (req, res, next) => {
  try {
    const { name, about, avatar, email, password } = req.body;

    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await User.create({ name, about, avatar, email, password: hash });
    return res.status(CREATED).send( await {
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
      email: newUser.email,
      _id: newUser._id,
    })
  } catch (error) {
    console.log(error);
    if (error.code === MONGO_DUPLICATE_ERROR_CODE) {
      return next(new ConflictError('Пользователь с таким email уже зарегистрирован'))
    }
    if (error.name === 'ValidationError') {
      return next(new ValidationError('Ошибка валидации полей'))
    }
    return next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {

    const user = await User.findOne({ email }).select('+password').orFail(() => new UnauthorizedError('Пользователь не найден'));

    const matched = await bcrypt.compare(String(password), user.password);
    if(!matched) {
      throw new UnauthorizedError('NotAuthenticated')
    }

    const token = generateToken({ _id: user._id });

    res.cookie('jwt', token, {
      maxAge: 3600000,
      httpOnly: true,
      sameSite: true,
    })

    return res.status(SUCCESS).send({ token })

  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new ValidationError('Ошибка валидации полей'))
    }
    return next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id).orFail(() => new NotFoundError('Пользователь не найден'));
    return res.send({ data: user });
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new CastError('Передан невалидный id'))
    }
    return next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    next(error)
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(() => new NotFoundError('Пользователь не найден'));
    return res.send(user);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new CastError('Передан невалидный id'))
    }
    return next(error);

  }
};

const updateUser = async (req, res, next) => {
  const owner = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(
      owner,
      { name: req.body.name, about: req.body.about },
      {
        new: true,
        runValidators: true,
      },
    ).orFail(() => new NotFoundError('Пользователь не найден'));
    return res.send(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new ValidationError('Ошибка dвалидации полей'))
    }
    return next(error);
  }
};

const updateUserAvatar = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const user = await User.findByIdAndUpdate(
      owner,
      { avatar: req.body.avatar },
      {
        new: true,
        runValidators: true,
      },
    ).orFail(() => new NotFoundError('Пользователь не найден'));
    return res.send(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new ValidationError('Переданы некорректные данные при обновлении аватара'))
    }
    return next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  login,
  getCurrentUser,
  updateUser,
  updateUserAvatar,
};
