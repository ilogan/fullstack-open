const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const blogRouter = require("./controllers/blog");
const cors = require("cors");

const app = express();

console.log("connecting to", config.MONGODB_URL);

mongoose.set("useFindAndModify", false);

mongoose
  .connect(config.MONGODB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch(error => {
    console.log("error connecting to MongoDB", error.message);
  });

app.use(express.json());
app.use(cors());

app.use("/api/blogs", blogRouter);

module.exports = app;
