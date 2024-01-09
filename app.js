const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const swaggerUI=require("swagger-ui-express");

// Додавання данних з env змінні оточення process.env
require("dotenv").config();
// Додавання маршрутів
const contactsRouter = require('./routes/api/contacts');
const authRouter = require("./routes/api/users");
const swaggerDocument = require("./swagger/contacts.json")

const app = express();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
// Мідлваре для обмеження доступу на сайт( передається список адрес)
app.use(cors());
app.use(express.json());
// Middleware звідки брати файли коли прийде запит
app.use(express.static("public"));

// Обробка запитів на api за допомогою маршрутів
app.use("/api/users", authRouter);
app.use('/api/contacts',swaggerUI.serve,swaggerUI.setup(swaggerDocument), contactsRouter);


app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
