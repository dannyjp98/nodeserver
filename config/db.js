//FILENAME : db.js

const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true)
// Replace this with your MONGOURI.
const MONGOURI = "mongodb+srv://dpark:joey1234@cluster0-p65ai.mongodb.net/ServerAPI?retryWrites=true&w=majority";

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to DB !!");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;