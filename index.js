require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const Note = require("./models/note");

const app = express();
const PORT = process.env.PORT;

app.use(express.static("build"));
app.use(express.json());
app.use(cors());

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

/* GET */
app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.get("/api/notes", (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes.map(note => note.toJSON()));
  });
});

app.get("/api/notes/:id", (req, res, next) => {
  Note.findById(req.params.id)
    .then(note => {
      if (note) {
        res.json(note.toJSON());
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

/* CREATE */
app.post("/api/notes", (req, res, next) => {
  const body = req.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  });

  note
    .save()
    .then(savedNote => savedNote.toJSON())
    .then(savedAndFormattedNote => res.json(savedAndFormattedNote))
    .catch(error => next(error));
});

/* UPDATE */
app.put("/api/notes/:id", (req, res, next) => {
  const body = req.body;

  const note = {
    content: body.content,
    important: body.important
  };

  Note.findByIdAndUpdate(req.params.id, note, { new: true })
    .then(updatedNote => {
      res.json(updatedNote.toJSON());
    })
    .catch(error => next(error));
});

/* DELETE */
app.delete("/api/notes/:id", (req, res, next) => {
  Note.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(error => next(error));
});

// handler of requests to unknown endpoint
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

// handler of requests with result to errors
const errorHandler = (error, req, res, next) => {
  console.error(error.messaage);

  if (error.name === "CastError" && error.kind == "ObjectId") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
