const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const config = require("./utils/config");
const middleware = require("./utils/middleware");
const notesRouter = require("./controllers/notes");

const app = express();

console.log("connecting to", config.MONGODB_URL);

mongoose.set("useFindAndModify", false);

mongoose
  .connect(config.MONGODB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("connected to MongdoDB");
  })
  .catch(error => {
    console.log("error connection to MongdoDB", error.message);
  });

app.use(express.static("build"));
app.use(express.json());
app.use(cors());
app.use(middleware.requestLogger);

app.use("/api/notes", notesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
