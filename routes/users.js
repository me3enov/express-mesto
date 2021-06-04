const users = require('express').Router();
const {
  getUsers,
  getCurrentUser,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

users.get('/users', getUsers);
users.get('/users/:_id', getCurrentUser);
users.post('/users', createUser);
users.patch('/users/me', updateUser);
users.patch('/users/me/avatar', updateAvatar);

module.exports = users;
