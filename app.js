const express = require('express');

const mongoose = require('mongoose');

const router = require('./routes/index');

mongoose.set('strictQuery', true);

const { PORT = 3000 } = process.env;

const app = express();

app.use((req, res, next) => {
  req.owner = {
    _id: '63a9119cfc3e70eaf7560a9e',
  };
  next();
});

app.use('/', router);

app.use('/*', ((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
}));

async function connectDB() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
  });
  app.listen(PORT);
}
connectDB();
