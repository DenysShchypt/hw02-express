
const mongoose = require("mongoose");
const app = require('./app');
const {DB_HOST, PORT = 3000}=process.env;
// const {Contact}=require('./models/contact')
mongoose.set("strictQuery", true);

mongoose.connect(DB_HOST).then(app.listen(PORT, () => {
  // const result = Contact.find();
  // console.log(result);

  console.log("Database connection successful")
})).catch(error => {
  console.log(error.message);
  process.exit(1);
});


