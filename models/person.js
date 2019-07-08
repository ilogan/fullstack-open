const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const url = process.env.MONGODB_URI;

//stop depraction warnings
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true); // comes from setting unique

// connect to database
mongoose
  .connect(url, { useNewUrlParser: true })
  .then(result => console.log("connected to MongoDB"))
  .catch(error => console.log(`error connecting to MongoDB:`, error.message));

// create person schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    // setting unique (true OR false) creates index in mongodb
    // must drop index if already created to change
    unique: true
  },
  number: {
    type: String
  }
});

personSchema.plugin(uniqueValidator);

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
