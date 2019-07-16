const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const [, , password, name, number] = process.argv;

const url = `mongodb+srv://fullstack:${password}@cluster0-tqmle.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model("Person", personSchema);

if (name && number) {
  const person = new Person({
    name,
    number
  });

  person
    .save()
    .then(() => {
      console.log("person saved!\n- closing connection -");
      mongoose.connection.close();
    })
    .catch(e => {
      console.log(e.message);
      mongoose.connection.close();
    });
} else {
  Person.find({})
    .then(persons => {
      console.log("phonebook:");
      persons.forEach(person => {
        console.log(person.name, person.number);
      });
      console.log("\n- closing connection -");
      mongoose.connection.close();
    })
    .catch(e => {
      console.log(e.message);
      mongoose.connection.close();
    });
}
