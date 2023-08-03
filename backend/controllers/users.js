const bcrypt = require('bcrypt')
const router = require('express').Router()
const User = require('../models/user')

// Create new User
router.post('/', async (request, response) => {
    const { username, name, role, password } = request.body

    if ( !password || password.length < 3) {
        return response.status(400).json({
            error: '`password` is shorter than the minimum allowed length (3)'
        })
    }

    const duplicate_user = await User.find({ username:username })
    if ( duplicate_user.length !== 0) {
        return response.status(400).json({
            error: 'The `username` is unavailable. Please choose another one.'
        })
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        role,
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

// Add AccessToken to User
router.patch('/:id', async (request, response) => {
    const { accessToken } = request.body
    console.log('accessToken:', request.body)
    console.log('accessToken:', accessToken)

    //const saltRounds = 10
    //const accessTokenHash = await bcrypt.hash(accessToken, saltRounds)

    const user = {
        accessTokenHash: accessToken, //accessTokenHash,
    }
    const updatedUser = await User.findByIdAndUpdate(request.params.id, user)
    response.status(200).json(updatedUser)
})

// Test - Update User
router.put('/:id', async (request, response, next) => {
    const body = request.body

    const user = {
        username: body.username,
        name: body.name,
        role: body.role,
        passwordHash: body.passwordHash,
    }

    await User.findByIdAndUpdate(request.params.id, user, { new: true })
        .then(updatedUser => {
            response.json(updatedUser)
        })
        .catch(error => next(error))
})

// Delete User
router.delete('/:id', async (request, response) => {
    console.log("deleting with id "+request.params.id)
    const user = await User.findById(request.params.id)
    if (!user) {
        return response.status(401).json({ error: 'operation not permitted' })
    }
    await User.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

module.exports = router