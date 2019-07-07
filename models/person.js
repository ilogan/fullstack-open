const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

// connect to database
mongoose
  .connect(url, { useNewUrlParser: true })
  .then(result => console.log("connected to MongoDB"))
  .catch(error => console.log(`error connecting to MongoDB:`, error.message));

// create person schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

// set toJSON middleware (can be called explicitly or with JSON.stringify)
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

// create Person model from schema and export
module.exports = mongoose.model("Person", personSchema);
