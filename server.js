
const mongoose = require("mongoose");
const app = require('./app');
// const {DB_HOST, PORT = 3000}=process.env;
// const {Contact}=require('./models/contact')
// mongoose.set("strictQuery", true);
const DB_HOST="mongodb+srv://Denys:rqwslprF0ZWrAgdF@cluster0.mstgf4x.mongodb.net/db-contacts?retryWrites=true&w=majority"

mongoose.connect(DB_HOST).then(app.listen(3000, () => {
  // const result = Contact.find();
  // console.log(result);

  console.log("Database connection successful")
})).catch(error => {
  console.log(error.message);
  process.exit(1);
});


