const express = require('express');
const {
  getUsers,
  getUserById,
  getUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

const { validateUpdateAvatar } = require('../middlewares/validation');

const userRouter = express.Router();

userRouter.get('/me', getUser);
userRouter.get('/', getUsers);
userRouter.get('/:id', getUserById);
userRouter.patch('/me', updateProfile);
userRouter.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = userRouter;
