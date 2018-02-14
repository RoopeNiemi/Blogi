const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Reactia opiskellaan yliopistossa',
    author: 'Robert Fear',
    url: 'http://reactblogejamaailmalta.com/yliopistossa',
    likes: 5
  },
  {
    title: 'Reactia opiskellaan myös muualla',
    author: 'Robert Terror',
    url: 'http://reactblogejamaailmalta.com/muualla',
    likes: 11
  },
  {
    title: 'Reactia voi vain osata',
    author: 'Robert Calm',
    url: 'http://reactblogejamaailmalta.com/osaa',
    likes: 23
  }
]

const format = blog => {
  return {
    title: blog.title,
    author: blog.author,
    id: blog._id,
    likes:blog.likes
  }
}

const nonExistingId = async () => {
  const blog = new Blog()
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(format)
}

module.exports = {
  initialBlogs,
  format,
  nonExistingId,
  blogsInDb
}
