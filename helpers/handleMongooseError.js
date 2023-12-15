// Обробка помилки з невірним записом status
const handleMongooseError = (error, data, next) => {
  error.status = 400;
  next()
};

module.exports = handleMongooseError;
