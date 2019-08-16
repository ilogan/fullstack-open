const notesRouter = require("express").Router();
const jwt = require("jsonwebtoken");

const Note = require("../models/note");
const User = require("../models/user");

/* UTILITIES */
const getTokenFrom = req => {
  try {
    const authorization = req.get("authorization");

    if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
      return authorization.substring(7);
    }
    return null;
  } catch (e) {
    console.error(e.message);
  }
};

/* READ */
notesRouter.get("/", async (req, res) => {
  const notes = await Note.find({}).populate("user", { username: 1, name: 1 });
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
  const token = getTokenFrom(req);

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!token || !decodedToken.id) {
      return res.status(401).json({ error: "token missing or invalid" });
    }

    const user = await User.findById(decodedToken.id);

    const note = new Note({
      content: body.content,
      important: body.important || false,
      date: new Date(),
      user: user._id
    });

    const savedNote = await note.save();
    user.notes = user.notes.concat(savedNote._id);
    await user.save();
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
