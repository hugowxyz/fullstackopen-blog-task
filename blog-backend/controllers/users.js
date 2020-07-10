const usersRouter = require('express').Router()
const User = require('../models/user')

const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
        .populate('blogs', { title: 1, url:1, likes: 1 })
    response.json(users.map(user => user.toJSON()))
})

usersRouter.post('/', async (request, response) => {
    const body = request.body

    if (body.password.length <= 3) {
        return response.status(400).send({ error: 'password must be atleast 3 characters long' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const newUser = new User({
        username: body.username,
        name: body.name,
        passwordHash,
        blogs: []
    })

    const returnedUser = await newUser.save()

    response.status(201).json(returnedUser.toJSON())
})

module.exports = usersRouter