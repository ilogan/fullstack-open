require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/", (req, res) => {
  res.send("<h1>Phonebook</h1>");
});

app.get("/api/persons", (req, res) => {
  Person.find({})
    .then(persons => {
      res.json(persons.map(person => person.toJSON()));
    })
    .catch(error => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON());
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(error => next(error));
});

app.post("/api/persons", (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).json({ error: "name is missing" });
  } else if (!req.body.number) {
    return res.status(400).json({ error: "number is missing" });
  }

  const person = new Person({
    name: req.body.name,
    number: req.body.number
  });

  person
    .save()
    .then(savedPerson => {
      res.json(savedPerson.toJSON());
    })
    .catch(error => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  console.log(req.body);
  const person = {
    name: req.body.name,
    number: req.body.number
  };

  if (!person.name) {
    return res.status(400).json({ error: "name is missing" });
  }
  if (!person.number) {
    return res.status(400).json({ error: "number is missing" });
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      if (updatedPerson) {
        res.json(updatedPerson.toJSON());
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.get("/info", (req, res) => {
  Person.find({}).then(persons => {
    res.send(
      `<p>Phonebook has info for ${persons.length} people</p>
      <p>${Date()}</p>`
    );
  });
});

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === "CastError" && error.kind === "ObjectId") {
    return res.status(400).json({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
