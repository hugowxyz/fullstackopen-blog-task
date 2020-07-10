const app = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const jwt = require('jsonwebtoken')

app.get('/', async (request, response) => {
    const blogs = await Blog.find({})
        .populate('user', { username: 1, name: 1 })
    response.json(blogs.map(blog => blog.toJSON()))
})

app.post('/', async (request, response) => {
    const body = request.body

    console.log("request token:", request.token)

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if ( !request.token || !decodedToken.id ) {
        return response.status(400).json({ error: 'invalid token' })
    }
    
    const user = await User.findById(decodedToken.id)
    
    const newBlog = new Blog({
        title: body.title,
        url: body.url,
        author: body.author || 'Guest Writer',
        user: user.id,
        likes: body.likes || 0
    })
    
    let returnedBlog = await newBlog.save()

    user.blogs = user.blogs.concat(returnedBlog.id)

    await user.save()

    returnedBlog = await Blog.findById(returnedBlog.id)
        .populate('user', { username: 1, name: 1 })

    response.status(201).json(returnedBlog.toJSON())
})

app.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
        .populate('user', { username: 1, name: 1 })
    if (blog) {
        response.json(blog.toJSON())
    } else {
        response.status(404).send({ error: 'blog not found' })
    }
})

app.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        .populate('user', { username: 1, name: 1 })
    response.json(updatedBlog.toJSON())
})

app.delete('/:id', async (request, response) => {

    if (request.token === null) {
        return response.status(400).send({ error: 'invalid token' })
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const blogToDelete = await Blog.findById(request.params.id)

    console.log("token", decodedToken.id)
    console.log("blog", blogToDelete.user)


    if (decodedToken.id.toString() === blogToDelete.user.toString()) {

        await Blog.findByIdAndRemove(blogToDelete.id)
        
        const user = await User.findById(decodedToken.id)        
        user.blogs = user.blogs.filter(id => id.toString() !== blogToDelete.id.toString())
        
        await user.save()
        response.status(200).end()

    } else {
        response.status(400).send({ error: 'not creator of blog' })
    }

})

module.exports = app