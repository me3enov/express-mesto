const Card = require('../models/card');
const ValidationError = require('../errors/ValidationError');
const AccessError = require('../errors/AccessError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('user')
    .then((data) => {
      res
        .status(200)
        .send(data);
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((data) => {
      res
        .status(200)
        .send(data);
    })
    .catch((error) => {
      throw new ValidationError(error.message);
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (card.owner.toString() !== req.params.id) {
        throw new AccessError('Access is denied');
      }
      Card.findByIdAndDelete(req.params.id)
        .then((data) => {
          res
            .status(200)
            .send(data);
        })
        .catch(next);
    })
    .catch((error) => {
      throw new NotFoundError(error.message);
    })
    .catch(next);
}

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((data) => {
      res
        .status(200)
        .send(data);
    })
    .catch((error) => {
      throw new NotFoundError(error.message);
    })
    .catch(next);
}

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true })
    .then((data) => {
      res
        .status(200)
        .send(data);
    })
    .catch((error) => {
      throw new NotFoundError(error.message);
    })
    .catch(next);
};