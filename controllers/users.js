const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

const checkErrors = (error) => {
  if (error.message === 'NullReturned' || error.name === 'CastError') {
    throw new NotFoundError(error.message);
  } else {
    throw new ValidationError(error.message);
  }
}

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res
        .status(200)
        .send({ data: users });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.params._id)
  .then((user) => {
    res
      .status(200)
      .send({ data: user });
  })
  .catch((error) => {
    throw new NotFoundError(error.message);
  })
  .catch(next);
}

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res
        .status(200)
        .send({ data: user });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.findByIdAndUpdate(req.user._id,
    { name, about, avatar },
    {
      new: true,
      runValidators: true,
    })
    .then((user) => {
      res
        .status(200)
        .send({ data: user });
    })
    .catch((error) => {
      checkErrors(error);
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    })
    .then((newAvatar) => {
      res
        .status(200)
        .send({ data: newAvatar });
    })
    .catch((error) => {
      checkErrors(error);
    })
    .catch(next);
};