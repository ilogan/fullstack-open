const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const port = 3001;

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
];

app.use(express.json());
app.use(cors());

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(note => note.id !== id);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const id = Math.floor(Math.random() * 1000000000);
  const person = {
    name: req.body.name,
    number: req.body.number,
    id
  };
  const personExists = persons.find(p => p.name === person.name);

  if (!person.name) {
    return res.status(400).json({ error: "name is missing" });
  } else if (!person.number) {
    return res.status(400).json({ error: "number is missing" });
  } else if (personExists) {
    return res
      .status(400)
      .json({ error: `${person.name} already exists in phonebook` });
  }
  persons = persons.concat(person);
  res.status(201).json(person);
});

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${Date()}</p>`
  );
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
