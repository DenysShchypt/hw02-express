
const mongoose=require("mongoose");
// const {DB_HOST, PORT = 3000}=process.env;
const DB_HOST = "mongodb+srv://Denys:d2KR7fvS9hQhV2nU@cluster0.vj6xgqm.mongodb.net/db-contacts"
const app = require('./app');

mongoose.connect(DB_HOST).then(app.listen(3000, () => {
  console.log("Database connection successful")
})).catch(error=>{
  console.log(error.message);
  process.exit(1);
});


