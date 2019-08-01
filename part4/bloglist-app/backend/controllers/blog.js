const blogRouter = require("express").Router();

const Blog = require("../models/blog");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  try {
    const blog = new Blog(request.body);

    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (e) {
    response.status(400).json({ error: e.message });
  }
});

blogRouter.delete("/:id", async (request, response) => {
  try {
    const blogToDelete = await Blog.findByIdAndDelete(request.params.id);
    response.status(200).json(blogToDelete);
  } catch (e) {
    response.status(204).json({ error: e.message });
  }
});

blogRouter.put("/:id", async (request, response) => {
  try {
    const body = request.body;

    const blog = {};
    // only update likes
    if (body.likes) {
      blog.likes = body.likes;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true
    });
    response.json(updatedBlog.toJSON());
  } catch (e) {
    response.json({ error: e.message });
  }
});

module.exports = blogRouter;
