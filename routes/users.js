const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

const {
  userIdValidator,
  userDataValidator,
  userAvatarValidator,
} = require('../middlewares/validators/userValidator');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', userIdValidator, getUserById);
router.patch('/me', userDataValidator, updateUser);
router.patch('/me/avatar', userAvatarValidator, updateUserAvatar);

module.exports = router;
