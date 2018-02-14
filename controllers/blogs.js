const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
  const blogs=await Blog.find({})
  response.json(blogs)
})
  
blogsRouter.post('/',  async (request, response) => {
  try{
    const body=request.body
    if(body.title===undefined || body.url===undefined){
      return response.status(400).json({error: 'no title or url'})
    }
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes
  })
  const savedBlog= await blog.save()
  response.json(blog)
  }
  catch(exception){
    console.log(exception)
    response.status(500).json({error: 'did not work'})
  }
})

blogsRouter.get('/:id',async(request,response)=>{
  try{
    const blog=await Blog.findById(request.params.id)
    if(blog){
      response.json(blog)
    } else{
      response.status(404).end()
    }
  }
  catch(error){
    response.status(400).send({ error: 'malformatted id' })
  }
})

blogsRouter.delete('/:id',async(request, response)=>{
  try{
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }
  catch(error){
    response.status(400).send({ error: 'malformatted id' })
  }
})

blogsRouter.put('/:id',async(request, response)=>{
  try{
    const body=request.body

    const blog={
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }
    await Blog.findByIdAndUpdate(request.params.id,blog,{new:true})
    const returnBlog=await Blog.findById(request.params.id)
    
    response.json(returnBlog)
  }
  catch(error){
    response.status(400).send({ error: 'malformatted id' })
  }
})
module.exports = blogsRouter