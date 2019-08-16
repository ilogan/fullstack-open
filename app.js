const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const config = require("./utils/config");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");

const notesRouter = require("./controllers/notes");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

const app = express();

logger.info("connecting to", config.MONGODB_URL);

//   used to stop deprecation warning from "findByIdAndUpdate"
//   (instead of set, option can be passed to mongoose.connect)
//*     mongoose.set("useFindAndModify", false);

mongoose
  .connect(config.MONGODB_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
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
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
