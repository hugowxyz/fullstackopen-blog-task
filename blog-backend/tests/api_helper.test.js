const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlog = [
    {
        title: 'ECMA Script 10: What\'s new',
        author: 'Guest contributor',
        url: 'testtest',
        likes: 2
    },
    {
        title: 'Testing out functional components in ReactJS',
        author: 'Guest contributor',
        url: 'testtest',
        likes: 5
    },
]

const initialUsers = [
    {
        username: 'hoodle',
        name: 'Hung Phan Huy',
        password: 'password'
    },
    {
        username: 'user test',
        name: 'test user',
        password: 'test'
    }
    
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlog, blogsInDb,
    initialUsers, usersInDb
}