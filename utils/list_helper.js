const dummy = blogs => {
  return 1;
};

const totalLikes = blogs => {
  const reducer = (sum, blog) => {
    return sum + blog.likes;
  };
  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
};

const favoriteBlog = blogs => {
  let maxLikes = -1;
  let favoriteIndex = null;

  // find blog with most likes
  for (let [i, blog] of blogs.entries()) {
    if (blog.likes > maxLikes) {
      maxLikes = blog.likes;
      favoriteIndex = i;
    }
  }
  // return blog if exists
  if (maxLikes !== -1) {
    const favoriteBlog = blogs[favoriteIndex];
    return {
      title: favoriteBlog.title,
      author: favoriteBlog.author,
      likes: favoriteBlog.likes
    };
  }
  // return empty object if null
  return {};
};
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
};
