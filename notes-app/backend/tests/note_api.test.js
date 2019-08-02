const mongoose = require("mongoose");
const supertest = require("supertest");

const app = require("../app");
const helper = require("./test_helper");

const Note = require("../models/note");
const User = require("../models/user");

const api = supertest(app);

describe("when there is initially some notes saved", () => {
  beforeEach(async () => {
    await Note.deleteMany({});

    for (let note of helper.initialNotes) {
      const noteObject = new Note(note);
      await noteObject.save();
    }
  });
  test("notes are returned as json", async () => {
    await api
      .get("/api/notes")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all notes are returned", async () => {
    const response = await api.get("/api/notes");
    expect(response.body.length).toBe(helper.initialNotes.length);
  });

  test("a specific note is within the returned notes", async () => {
    const response = await api.get("/api/notes");
    const contents = response.body.map(r => r.content);
    expect(contents).toContain("Browser can execute only Javascript");
  });

  describe("viewing a specific note", () => {
    test("succeeds with a valid id", async () => {
      const notesAtStart = await helper.notesInDb();
      const noteToView = notesAtStart[0];

      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(resultNote.body).toEqual(noteToView);
    });

    test("fails with a statuscode 404 if note does not exist", async () => {
      const validNonexistingId = await helper.nonExistingId();

      console.log(validNonexistingId);

      await api.get(`/api/notes/${validNonexistingId}`).expect(404);
    });

    test("fails with statuscode 400 if id is invalid", async () => {
      const invalidId = "5a3d5da59070081a82a3445";

      await api.get(`/api/notes/${invalidId}`).expect(400);
    });
  });

  describe("addition of a new note", () => {
    test("succeeds with valid data", async () => {
      const newNote = {
        content: "async/await simplifies making async calls",
        important: true
      };

      await api
        .post("/api/notes")
        .send(newNote)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const notesAtEnd = await helper.notesInDb();
      expect(notesAtEnd.length).toBe(helper.initialNotes.length + 1);

      const contents = notesAtEnd.map(n => n.content);

      expect(contents).toContain("async/await simplifies making async calls");
    });

    test("fails with status code 400 if data invalid", async () => {
      const newNote = {
        important: true
      };

      await api
        .post("/api/notes")
        .send(newNote)
        .expect(400);

      const notesAtEnd = await helper.notesInDb();
      expect(notesAtEnd.length).toBe(helper.initialNotes.length);
    });
  });

  describe("deletion of a note", () => {
    test("a note can be deleted", async () => {
      const notesAtStart = await helper.notesInDb();
      const noteToDelete = notesAtStart[0];
      await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

      const notesAtEnd = await helper.notesInDb();

      expect(notesAtEnd.length).toBe(helper.initialNotes.length - 1);

      const contents = notesAtEnd.map(r => r.content);

      expect(contents).not.toContain(noteToDelete.content);
    });
  });
});

describe("when there is initially one user at db", () => {
  beforeEach(async () => {
    // delete all users from db
    await User.deleteMany({});

    // create new user
    const user = new User({ username: "root", password: "sekret" });

    //save user
    await user.save();
  });

  test("creation succeeds with fresh username", async () => {
    // get initial users from db 1
    const usersAtStart = await helper.usersInDb();

    // create new user 4
    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen"
    };

    // post and check new user 5
    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    // check that db length is what is should be 2
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1);

    // check that username is in db 2
    const usernames = usersAtEnd.map(u => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails with status 400 if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "superuser",
      password: "salainen"
    };

    const res = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(res.body.error).toContain("`username` to be unique");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
