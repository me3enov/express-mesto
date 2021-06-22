const users = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUsers,
  getCurrentUser,
  aboutUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

users.get('/users', auth, getUsers);
users.get('/users/:userId', auth, getCurrentUser);
users.get('/users/me', auth, aboutUser);
users.patch('/users/me', auth, updateUser);
users.patch('/users/me/avatar', auth, updateAvatar);

module.exports = users;
