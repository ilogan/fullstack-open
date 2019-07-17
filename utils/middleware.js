const logger = require("./logger");
const morgan = require("morgan");

// MORGAN REQUEST HANDLING
morgan.token("body", req => {
  return JSON.stringify(req.body);
});

const requestLogger = morgan(
  ":method :url :status :res[content-length] - :response-time ms :body"
);

// UNKNOWN ENDPOINT
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

// ERROR HANDLING
const errorHandler = (error, req, res, next) => {
  logger.error(error.message);

  if (error.name === "CastError" && error.kind === "ObjectId") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
};
