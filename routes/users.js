const express = require('express');
const {
  getUsers,
  getUserById,
  getUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

const { validateUpdateAvatar, validateObjectId, validateUpdateProfile } = require('../middlewares/validation');

const userRouter = express.Router();

userRouter.get('/me', getUser);
userRouter.get('/', getUsers);
userRouter.get('/:id', validateObjectId, getUserById);
userRouter.patch('/me', validateUpdateProfile, updateProfile);
userRouter.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = userRouter;
