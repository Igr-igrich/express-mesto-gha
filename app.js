const express = require('express');
const ViteExpress = require('vite-express');
const mongoose = require('mongoose');
const router = require('./routes/index');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  req.user = {
    _id: '6537ac20fe3a8990d0ae7e78',
  };

  next();
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Connected to MongoDb');
  });

app.use(express.json());

app.use(router);

app.use("/*", (req, res, next) => {
  res.status(404).send({ message: "Страница не найдена" });

  next();
});

ViteExpress.listen(app, PORT, () => console.log(`Server is listening on port ${PORT}...`));
