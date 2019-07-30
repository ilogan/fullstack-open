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

test("a valid  blog can be added", async () => {
  const newBlog = {
    title: "Test Note",
    author: "Tester",
    url: "http://lookatthistest.com",
    likes: 777
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const dbBlogs = await helper.blogsInDb();
  expect(dbBlogs.length).toBe(helper.initialBlogs.length + 1);

  const contents = dbBlogs.map(b => b.title);
  expect(contents).toContain("Test Note");
});

test("likes defaults to zero", async () => {
  const newBlog = {
    title: "This has no likes",
    author: "Tester",
    url: "test.com"
  };

  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  // test likes from response
  expect(response.body.likes).toBe(0);

  // double check likes in database
  const dbBlogs = await helper.blogsInDb();
  const blogWithNoLikes = dbBlogs.find(b => b.title === "This has no likes");
  expect(blogWithNoLikes.likes).toBe(0);
});

afterAll(() => {
  mongoose.connection.close();
});
