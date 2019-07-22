const mongoose = require("mongoose");
const supertest = require("supertest");

const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of helper.initialBlogs) {
    const blogObject = new Blog(blog);
    await blogObject.save();
  }
});

test("correct number of blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  // compare helper blogs to blogs in database
  const dbBlogs = await helper.blogsInDb();
  expect(dbBlogs.length).toBe(helper.initialBlogs.length);
});

test("unique id exists", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body[0].id).toBeDefined();
  expect(response.body[0]._id).not.toBeDefined();
});

afterAll(() => {
  mongoose.connection.close();
});
