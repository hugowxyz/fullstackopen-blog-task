const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const mongoose = require('mongoose')

const helper = require('./api_helper.test')

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogs = helper.initialBlog.map(blog => new Blog(blog))
    const promiseArray = blogs.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('getting all blogs', async () => {
    const blogs = await api.get('/api/blogs')

    expect(blogs.body.length).toBe(helper.initialBlog.length)
})

test('viewing an individual blog', async () => {
    const blogs = await helper.blogsInDb()
    const blogToView = blogs[0]
    blogToView.id = blogToView.id.toString()

    const returnedBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(returnedBlog.body).toEqual(blogToView)

})

test('all blogs have an id attribute', async () => {
    const blogs = await helper.blogsInDb()

    blogs.forEach(blog => {
        expect(blog.id).toBeDefined()
        expect(blog._id).not.toBeDefined()
        expect(blog.__v).not.toBeDefined()
    })
})

test('can add a valid blog (schema.save method)', async () => {
    const newBlog = new Blog({
        title: 'testing',
        author: 'test',
        url: 'empty',
        likes: 0
    })

    const blog = await newBlog.save() 

    console.log('SCHEMA.save method: ', blog) // Does not require blog.body, unprocessed

    const blogs = await helper.blogsInDb()

    expect(blogs.length).toBe(helper.initialBlog.length + 1)
})

test('can add a valid blog (post.send method)', async () => {
    const newBlog = {
        title: 'testing',
        author: 'test',
        url: 'empty',
        likes: 0
    }

    const blog = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    console.log("POST.send() method: ", blog.body)
    
    const blogs = await helper.blogsInDb()

    expect(blogs.length).toBe(helper.initialBlog.length + 1)

})

test('missing likes, will default to 0', async () => {
    const newBlog = {
        title: 'testing',
        author: 'test',
        url: 'empty',
    }

    const blog = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
    
    expect(blog.body.likes).toBeDefined()
    expect(blog.body.likes).toBe(0)
})

test('add blog with no title and url results in 400', async () => {
    const newBlog = {
        author: 'test',
        likes: 0
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const blogs = await helper.blogsInDb()

    expect(blogs.length).toBe(helper.initialBlog.length)
})

test('deleting a blog resource', async () => {
    const blogsInDb = await helper.blogsInDb()
    const blogToDelete = blogsInDb[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
    
    const blogs = await helper.blogsInDb()

    expect(blogs.length).toBe(helper.initialBlog.length - 1)
    
})

test('updating a blog resource', async () => {
    const blogsInDb = await helper.blogsInDb()
    const blogToUpdate = blogsInDb[0]

    const updatedBlog = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1
    }

    const returnedBlog = await api   
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)

    expect(returnedBlog.body.likes).toBe(blogToUpdate.likes + 1)

})

afterAll(() => {
    mongoose.connection.close()
})