const mongoose = require("mongoose");
const app = require('./app');

// Змінні оточення
const { DB_HOST, PORT = 3000 } = process.env;

// Підключення до бази
mongoose.connect(DB_HOST).then( () => {
  app.listen(PORT,console.log("Database connection successful"))
}).catch(error => {
  console.log(error.message);
  // Команда яка закриває запущені процеси
  process.exit(1);
});


