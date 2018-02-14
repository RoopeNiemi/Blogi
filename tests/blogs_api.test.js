const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const {
  format,
  initialBlogs,
  nonExistingId,
  blogsInDb
} = require('./test_helper')

describe('when there is initially some blogs saved', async () => {
  beforeAll(async () => {
    await Blog.remove({})

    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    await Promise.all(blogObjects.map(blog => blog.save()))
  })

  test('blogs are returned as json by GET /api/blogs', async () => {
    const blogsInDatabase=await blogsInDb()

    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBe(blogsInDatabase.length)

    const returnedContents = response.body.map(blog=> blog.title)
    blogsInDatabase.forEach(blog=>{
      expect(returnedContents).toContain(blog.title)
    })
  })

})
describe('adding blogs',async()=>{

  test(' a blog can be added', async () => {
    const blogsAtStart=await blogsInDb()
    const newBlog = {
      title: 'About React and its capabilities',
      author: 'Robert Bark',
      url: 'http://blogsaboutreact.com/capabilities',
      likes: 1
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAfterOperation=await blogsInDb()

    expect(blogsAfterOperation.length).toBe(blogsAtStart.length+1)

    const titles = blogsAfterOperation.map(blog=> blog.title)
    expect(titles).toContain('About React and its capabilities')
  })

  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'Fred Failingman',
      url: 'http://tamaeitoimi.fi'
    }
    const blogsBefore = await blogsInDb()
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAfter = await blogsInDb()

    expect(blogsAfter.length).toBe(blogsBefore.length)
  })

  test('blog without url is not added', async () => {
    const newBlog = {
      author: 'Fred Failingman',
      title: 'About failing tests'
    }
    const blogsBefore = await blogsInDb()

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAfter = await blogsInDb()

    expect(blogsAfter.length).toBe(blogsBefore.length)
  })

  test('blog with undefined likes has 0 likes', async () => {
    const newBlog = {
      author: 'Fred Failingman',
      title: 'About adding undefined likes',
      url: 'http://undefinedlikes.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await blogsInDb()
    const likes = blogsAfter.map(b => b.likes)
    const titles = blogsAfter.map(b => b.title)
    expect(titles).toContain('About adding undefined likes')
    expect(likes).toContain(0)
  })
})
describe('deletion of a blog', async()=>{
  let addedBlog

  beforeAll(async()=>{
    addedBlog= new Blog({
      title:'testTitle',
      author:'testAuthor',
      url:'testUrl'
    })
    await addedBlog.save()
  })

  test('DELETE /api/blogs/:id works', async()=>{
    const blogsAtStart=await blogsInDb()

    await api
      .delete(`/api/blogs/${addedBlog._id}`)
      .expect(204)
    
    const blogsAfter=await blogsInDb()

    const titles=blogsAfter.map(blog=> blog.title)
    expect(titles).not.toContain(addedBlog.title)

    expect(blogsAfter.length).toBe(blogsAtStart.length-1)

  })
})


afterAll(() => {
  server.close
})

