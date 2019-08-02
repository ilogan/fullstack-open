const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// create schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note"
    }
  ]
});

userSchema.plugin(uniqueValidator);

//set middleware
userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  }
});

// export model from schema
module.exports = mongoose.model("User", userSchema);
