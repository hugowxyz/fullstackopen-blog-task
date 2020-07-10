const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)

const User = require('../models/user')
const Blog = require('../models/blog')

const helper = require('./api_helper.test')

beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const users = helper.initialUsers.map(user => new User(user))
    const promiseArray = users.map(user => user.save())
    
    await Promise.all(promiseArray)
})

describe('getting users from db', () => {
    test('users all returned', async () => {
        const users = await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        expect(users.body.length).toBe(helper.initialUsers.length)
    })
})

describe('adding users to db', () => {
    test('adding valid user to db', async () => {
        const newUser = {
            username: "username",
            name: "hugo",
            password: "password"
        }

        const returnedUser = await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        expect(returnedUser).toBeDefined()
    })

    test('can\'t add invalid user to db', async () => {
        const newUser = {
            name: "invaliid user",
            password: "invalid"
        }

        const usersAtStart = await helper.usersInDb()

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()

        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

// describe('adding blogs to db', () => {
//     test('can add valid blog and updates users', async () => {
//         const users = await helper.usersInDb()
//         let user = users[0].id
        
//         const newBlog = {
//             title: 'Testing how to test',
//             url: 'testUrl',
//             author: 'testAuth',
//             user
//         }

//         const blogsAtStart = await helper.blogsInDb()

//         const returnedBlog = await api
//             .post('/api/blogs')
//             .send(newBlog)
//             .expect(201)
//             .expect('Content-Type', /application\/json/)

//         const blogsAtEnd = await helper.blogsInDb()
//         const usersAtEnd = await helper.usersInDb()

//         blogsAtEnd[0].user = blogsAtEnd[0].user.toString()
//         user = user.toString()


//         expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
//         expect(blogsAtEnd.map(blog => blog.content)).toContain(returnedBlog.body.content)
//         expect(blogsAtEnd[0].user).toBe(user)
//         expect(usersAtEnd[0].blogs).toHaveLength(users[0].blogs.length + 1)
//     })
// })

afterAll(() => {
    mongoose.connection.close()
})