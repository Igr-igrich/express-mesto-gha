const express = require('express');
const ViteExpress = require('vite-express');
require('dotenv').config();
const { errors } = require('celebrate');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./routes/index');


const app = express();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Connected to MongoDb');
  });

app.use(helmet());

app.use(express.json());
app.use(cookieParser());
app.use(router);
app.use(errors());


app.use("/*", (req, res, next) => {
  res.status(404).send({ message: "Страница не найдена" });

  next();
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  // console.log(err);

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message
    });
});

ViteExpress.listen(app, process.env.PORT, () => console.log(`Server is listening on port ${process.env.PORT}...`));
