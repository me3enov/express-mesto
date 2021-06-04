const Card = require('../models/card');

const expression = /^(ftp|http|https):\/\/.*\.(?:png|jpg|bmp|gif|jpeg|tiff|WebP)/i;

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('user')
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      res
        .status(500)
        .send({ message: `Server error: ${err.name}` });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res
        .status(200)
        .send({ data: card });
    })
    .catch((err) => {
      if (!expression.test(req.body.link)) {
        res
          .status(400)
          .send({ message: `Wrong data! Error: ${err.name}` });
      } else if (err.name === 'ValidationError') {
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

module.exports.deleteCard = (req, res) => {
  const id = req.params.cardId;
  Card.findByIdAndRemove(id)
    .then((card) => {
      if (!card) {
        res
          .status(404)
          .send({ message: 'Card not found!' });
      } else {
        res
          .status(200)
          .send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
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

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (!card) {
        res
          .status(404)
          .send({ message: 'Card not found!' });
      } else {
        res
          .status(200)
          .send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
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

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (!card) {
        res
          .status(404)
          .send({ message: 'Card not found!' });
      } else {
        res
          .status(200)
          .send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
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
