const card = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

card.get('/cards', auth, getCards);
card.post(
  '/cards',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().required().min(2).max(30),
        link: Joi.string().required(),
      })
      .unknown(true),
  }),
  auth,
  createCard,
);
card.delete('/cards/:cardId', auth, deleteCard);
card.put('/cards/:cardId/likes', auth, likeCard);
card.delete('/cards/:cardId/likes', auth, dislikeCard);

module.exports = card;
