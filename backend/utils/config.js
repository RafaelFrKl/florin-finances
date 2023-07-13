require('dotenv').config()
const { Configuration, PlaidEnvironments } = require('plaid')

const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

// Set up the Plaid client - Initialize the Plaid client library for NodeJS
const PLAID_CONFIG = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV], //sandbox or development
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SECRET,
            'Plaid-Version': '2020-09-14',
        },
    },
})

module.exports = {
    MONGODB_URI,
    PORT,
    PLAID_CONFIG
}