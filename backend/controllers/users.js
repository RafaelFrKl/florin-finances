const bcrypt = require('bcrypt')
const router = require('express').Router()
const User = require('../models/user')

// Create new User
router.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if ( !password || password.length < 3) {
        return response.status(400).json({
            error: '`password` is shorter than the minimum allowed length (3)'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

// Get all Users
router.get('/', async (request, response) => {
    const users = await User.find({})

    response.json(users)
})

// Get individual User
router.get('/:id', async (request, response) => {
    const user = await User.findById(request.params.id)
    if (user) {
        response.json(user)
    } else {
        response.status(404).end()
    }
})

// Test - Update User
router.put('/:id', async (request, response, next) => {
    const body = request.body

    const user = {
        username: body.username,
        name: body.name,
        passwordHash: body.passwordHash,
    }

    await User.findByIdAndUpdate(request.params.id, user, { new: true })
        .then(updatedUser => {
            response.json(updatedUser)
        })
        .catch(error => next(error))
})

module.exports = router