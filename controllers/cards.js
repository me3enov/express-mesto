const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('user')
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res
        .status(200)
        .send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Validation Error!'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const id = req.params.cardId;
  const userId = req.user._id;
  Card.findById(id)
    .orFail(new NotFoundError('Card not found!'))
    .then((card) => {
      if (card.owner === userId) {
        return Card.findByIdAndRemove(id)
          .orFail(new NotFoundError('Card not found!'))
          .then((data) => {
            res.status(200).send({ data });
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              next(new NotFoundError('Card not found!'));
            } else {
              next(err);
            }
          });
      }
      return next(new ForbiddenError('Access is denied!'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Card not found!'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Card not found!'))
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Card not found!'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true })
    .orFail(new NotFoundError('Card not found!'))
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError('Card not found!'));
      } else {
        next(err);
      }
    });
};
