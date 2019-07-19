const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const config = require("./utils/config");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const notesRouter = require("./controllers/notes");

const app = express();

logger.info("connecting to", config.MONGODB_URL);

mongoose.set("useFindAndModify", false);

mongoose
  .connect(config.MONGODB_URL, { useNewUrlParser: true })
  .then(() => {
    logger.info("connected to MongdoDB");
  })
  .catch(error => {
    logger.error("error connection to MongdoDB", error.message);
  });

app.use(express.static("build"));
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV !== "test") {
  app.use(middleware.requestLogger);
}

app.use("/api/notes", notesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
