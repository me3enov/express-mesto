const User = require('../models/user');

const expression = /^(ftp|http|https):\/\/.*\.(?:png|jpg|bmp|gif|jpeg|tiff|WebP)/i;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res
        .status(200)
        .send({ data: users });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: `Server error: ${err.name}` });
    });
};

module.exports.getCurrentUser = (req, res) => {
  const id = req.params.userId;
  User.findById(id)
    .then((user) => {
      if (user) {
        return res.status(200).send({ data: user });
      }
      return res.status(404).send({ message: 'User not found!' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .send({ message: `User not found! Error: ${err.name}` });
      } else {
        res
          .status(500)
          .send({ message: `Server error: ${err.name}` });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      if (!expression.test(avatar)) {
        res
          .status(400)
          .send({ message: 'Wrong data!' });
      } else {
        res
          .status(200)
          .send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({ message: `Wrong data! Error: ${err.name}` });
      } else {
        res
          .status(500)
          .send({ message: `Server error: ${err.name}` });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.findByIdAndUpdate(req.user._id,
    { name, about, avatar },
    {
      new: true,
      runValidators: true,
    })
    .then((user) => {
      if (user) {
        return res.status(200).send({ data: user });
      }
      return res.status(404).send({ message: 'User not found!' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({ message: `Wrong data! Error: ${err.name}` });
      } else {
        res
          .status(500)
          .send({ message: `Server error: ${err.name}` });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    })
    .then((user) => {
      if (user) {
        return res.status(200).send({ data: user });
      }
      return res.status(404).send({ message: 'User not found!' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({ message: `Wrong data! Error: ${err.name}` });
      } else {
        res
          .status(500)
          .send({ message: `Server error: ${err.name}` });
      }
    });
};
