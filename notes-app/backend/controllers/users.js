const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("notes", { content: 1, date: 1 });
  res.json(users.map(u => u.toJSON()));
});

usersRouter.post("/", async (req, res, next) => {
  try {
    // extract request
    const { username, name, password } = req.body;

    // salt password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // create user instance
    const user = new User({
      username,
      name,
      passwordHash
    });

    // save user
    const savedUser = await user.save();

    // respond with user
    res.status(201).json(savedUser);
  } catch (e) {
    next(e);
  }
});

module.exports = usersRouter;
