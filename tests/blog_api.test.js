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

describe("with initial blogs saved", () => {
  test("correct number of blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    // compare helper blogs to blogs in database
    const dbBlogs = await helper.blogsInDb();
    expect(dbBlogs.length).toBe(helper.initialBlogs.length);
  });

  test("unique id property exists", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body[0].id).toBeDefined();
    expect(response.body[0]._id).not.toBeDefined();
  });

  /*
   *------------------------
   *       POSTING
   *------------------------
   */
  describe("posting a new blog", () => {
    test("succeeds with valid data", async () => {
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

    test("likes property defaults to zero", async () => {
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
      const blogWithNoLikes = dbBlogs.find(
        b => b.title === "This has no likes"
      );
      expect(blogWithNoLikes.likes).toBe(0);
    });

    test("fails with 400 without title", async () => {
      const newBlog = {
        url: "testUrl"
      };

      const response = await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(400);

      expect(response.body.error).toBe(
        "Blog validation failed: title: Path `title` is required."
      );
    });

    test("fails with 400 without  url", async () => {
      const newBlog = {
        title: "testTitle"
      };

      const response = await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(400);

      expect(response.body.error).toBe(
        "Blog validation failed: url: Path `url` is required."
      );
    });
  });

  /*
   *------------------------
   *       DELETING
   *------------------------
   */
  describe("deleting a blog", () => {
    test("valid blog is deleted with status 200", async () => {
      const initialDbBlogs = await helper.blogsInDb();
      const blogToDelete = initialDbBlogs[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(200);

      const modifiedDbBlogs = await helper.blogsInDb();

      expect(modifiedDbBlogs.length).toBe(initialDbBlogs.length - 1);

      const titles = modifiedDbBlogs.map(b => b.title);

      expect(titles).not.toContain(blogToDelete.title);
    });
  });
  /*
   *------------------------
   *       UPDATING
   *------------------------
   */
  describe("updating a specific blog", () => {
    test("succeeds with valid id", async () => {
      const initialDbBlogs = await helper.blogsInDb();
      const blogToUpdate = initialDbBlogs[0];

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ likes: 55 })
        .expect(200);
      expect(response.body.likes).toBe(55);

      const modifiedDbBlogs = await helper.blogsInDb();
      const dbUpdatedBlog = modifiedDbBlogs.find(b => b.id === blogToUpdate.id);
      expect(dbUpdatedBlog.likes).toBe(55);
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
