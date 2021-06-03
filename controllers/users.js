const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: `Server error: ${err.message}` }));
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.params._id)
    .then((user) => res.status(200).res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Server error: ${err.message}` }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Server error: ${err.message}` }));
};

module.exports.updateUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.findByIdAndUpdate(req.user._id,
    { name, about, avatar },
    {
      new: true,
      runValidators: true,
    })
    .then((user) => res.status(200).res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Server error: ${err.message}` }));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    })
    .then((newAvatar) => res.status(200).res.send({ data: newAvatar }))
    .catch((err) => res.status(500).send({ message: `Server error: ${err.message}` }));
};