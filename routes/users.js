const express = require('express');
const {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

const userRouter = express.Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', getUserById);
userRouter.post('/', express.json(), createUser);
userRouter.patch('/me', express.json(), updateProfile);
userRouter.patch('/me/avatar', express.json(), updateAvatar);

module.exports = userRouter;
