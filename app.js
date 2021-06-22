const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const router = require('./routes/index');
const NotFoundError = require('./errors/NotFoundError.js');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Limiting to 100 requests per windowMs',
});

app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(router);

app.post('/signin', login);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }).unknown(true),
  }),
  createUser,
);

app.use(errors());

app.get('*', () => {
  throw new NotFoundError({ message: 'Page not found!' });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res
      .status(err.status)
      .send(err.message);
    return;
  }
  res
    .status(500)
    .send({ message: `Server error: ${err.name}` });
  next();
});

app.listen(PORT);
