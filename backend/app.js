const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
require('express-async-errors')

//Plaid Declarations
const bodyParser = require('body-parser')

const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const plaidRouter = require('./controllers/plaid')


const middleware = require('./utils/middleware')

//Connect to MongoDB
mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

//Plaid Declarations
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))

app.use(cors())
app.use(express.json())

//Use Production Build
app.use(express.static('build'))

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/plaid', plaidRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app