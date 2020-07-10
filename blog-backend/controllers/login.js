const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const body = request.body
    
    const user = await User.findOne({ username: body.username })

    const passwordCorrect = body.password === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return response.status(401)
            .send({ error: 'username or password wrong '})
    }

    const useForToken = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(useForToken, process.env.SECRET)

    response
        .status(200)
        .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter