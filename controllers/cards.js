const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('user')
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(500).send({ message: `Server error: ${err.message}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Server error: ${err.message}` }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params._id)
    .then((card) => res.status(200).res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Server error: ${err.message}` }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((likes) => res.status(200).res.send({ data: likes }))
    .catch((err) => res.status(500).send({ message: `Server error: ${err.message}` }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true })
    .then((likes) => res.status(200).res.send({ data: likes }))
    .catch((err) => res.status(500).send({ message: `Server error: ${err.message}` }));
};