// Обробка помилки з невірним записом status
const handleMongooseError = (error, data, next) => {
  // Визначаємо яка вийшла помилка з об'єкта error
  const { name, code } = error
  // Визначаємо чи є конфлікт 409
  const status = (name === "MongoServerError" && code === 11000) ? 409 : 400;
  // Присвоюємо статус помилки
  error.status = status;
  next()
};

module.exports = handleMongooseError;
