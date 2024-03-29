const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt=require('jsonwebtoken')

const getTokenFrom=(request)=>{
  const authorization=request.get('Authorization')
  if(authorization&& authorization.toLowerCase().startsWith('bearer')){
    return authorization.substring(7)
  }
  return null
}
blogsRouter.get('/', async (request, response) => {
  const blogs=await Blog.find({})
    .populate('user',{_id:1, username:1, name:1})
  response.json(blogs.map(Blog.format))
})
  
blogsRouter.post('/',  async (request, response) => {
  try{
    const body=request.body
    const token=getTokenFrom(request)
    const decodedToken=jwt.verify(token,process.env.SECRET)
    if(!token || !decodedToken.id){
      return response.status(401).json({error: 'token missing or invalid'})
    }

    if(body.title===undefined || body.url===undefined){
      return response.status(400).json({error: 'no title or url'})
    }
    const user=await User.findById(decodedToken.id)
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user._id
  })
  const savedBlog= await blog.save()
  user.blogs=user.blogs.concat(savedBlog._id)
  await user.save()
  response.json(Blog.format(savedBlog))
  }
  catch(exception){
    if(exception.name==='JsonWebTokenError'){
      response.status(401).json({error: exception.message})
    }
    else{
    console.log(exception)
    response.status(500).json({error: 'did not work'})
  }}
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