const notesRouter = require("express").Router();

const Note = require("../models/note");

/* READ */
notesRouter.get("/", async (req, res) => {
  const notes = await Note.find({});
  res.json(notes.map(note => note.toJSON()));
});

notesRouter.get("/:id", async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (note) {
      res.json(note.toJSON());
    } else {
      res.status(404).end();
    }
  } catch (e) {
    next(e);
  }
});

/* CREATE */
notesRouter.post("/", async (req, res, next) => {
  const body = req.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  });
  try {
    const savedNote = await note.save();
    res.json(savedNote.toJSON());
  } catch (e) {
    next(e);
  }
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
notesRouter.delete("/:id", async (req, res, next) => {
  try {
    await Note.findByIdAndRemove(req.params.id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

module.exports = notesRouter;
