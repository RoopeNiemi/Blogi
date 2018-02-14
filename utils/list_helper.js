const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  const reducer = (sum, item) => {
    return sum + item
  }
  return blogs.length === 0
    ? 0
    : blogs.map(blog => blog.likes).reduce(reducer, 0)
}

const favoriteBlog = blogs => {
  if (blogs.length === 0) {
    return 'no blogs'
  }
  let blogWithMostLikes = blogs[0]
  for (var i = 0; i < blogs.length; i++) {
    if (blogWithMostLikes.likes < blogs[i].likes) {
      blogWithMostLikes = blogs[i]
    }
  }
  return blogWithMostLikes
}

const mostBlogs = blogs => {
  if (blogs.length === 0) {
    return 'no blogs'
  }
  let authorName = {
    author: blogs[0].author,
    blogs: 0
  }

  for (var i = 0; i < blogs.length; i++) {
    let totalBlogs = 0
    for (var j = 0; j < blogs.length; j++) {
      if (blogs[j].author === blogs[i].author) {
        totalBlogs++
      }
    }
    if (totalBlogs > authorName.blogs) {
      authorName = {
        author: blogs[i].author,
        blogs: totalBlogs
      }
    }
  }
  return authorName
}

const mostLikes = blogs => {
  if (blogs.length === 0) {
    return 'no blogs'
  }
  let authorName = {
    author: blogs[0].author,
    likes: 0
  }

  for (var i = 0; i < blogs.length; i++) {
    let totalLikes = 0
    for (var j = 0; j < blogs.length; j++) {
      if (blogs[i].author === blogs[j].author) {
        totalLikes = blogs[j].likes + totalLikes
      }
    }
    if (totalLikes > authorName.likes) {
      authorName = {
        author: blogs[i].author,
        likes: totalLikes
      }
    }
  }
  return authorName
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
