const express = require('express');

const mongoose = require('mongoose');

const dotenv = require('dotenv');

const { errors } = require('celebrate');

const router = require('./routes');
const errorHandler = require('./middlewares/errors-handler');

mongoose.set('strictQuery', true);

dotenv.config();

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use(express.json());

app.use('/', router);

app.use(errors());

app.use(errorHandler);

async function connectDB() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
  });
  app.listen(PORT);
}
connectDB();
