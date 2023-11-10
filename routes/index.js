const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

const {
  createUserValidator,
  loginValidator,
} = require('../middlewares/validators/userValidator');

router.post('/signin', loginValidator, login);
router.post('/signup', createUserValidator, createUser);

router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);

module.exports = router;
