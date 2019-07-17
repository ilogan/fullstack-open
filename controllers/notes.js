const notesRouter = require("express").Router();

const Note = require("../models/note");

/* READ */
notesRouter.get("/", async (req, res) => {
  const notes = await Note.find({});
  res.json(notes.map(note => note.toJSON()));
});

notesRouter.get("/:id", (req, res, next) => {
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
notesRouter.post("/", (req, res, next) => {
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
notesRouter.put("/:id", (req, res, next) => {
  const body = req.body;

  const note = {
    content: body.content,
    important: body.important
  };

  Note.findByIdAndUpdate(req.params.id, note, { new: true })
    .then(updatedNote => updatedNote.toJSON())
    .then(updatedAndFormattedNote => res.json(updatedAndFormattedNote))
    .catch(error => next(error));
});

/* DELETE */
notesRouter.delete("/:id", (req, res, next) => {
  Note.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(error => next(error));
});

module.exports = notesRouter;
