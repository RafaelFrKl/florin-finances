// Import required modules
const plaidrouter = require('express').Router()
const { PlaidApi } = require('plaid')
const config = require('../utils/config')

// Create Plaid client instance
const plaidClient = new PlaidApi(config.PLAID_CONFIG)

// eslint-disable-next-line no-unused-vars
plaidrouter.get('/run_precheck', async (req, res, next) => {
    try {
        if (process.env.PLAID_CLIENT_ID === null || process.env.PLAID_CLIENT_ID === '') {
            res.json({
                status: 'error', errorMessage: `We didn't find a client ID in the .env file. Please make sure to copy 
      the appropriate variable from the Plaid dashboard` })
            return
        } else if (process.env.PLAID_SECRET === null || process.env.PLAID_SECRET === '') {
            res.json({
                status: 'error',
                errorMessage: `We didn't find a secret in the .env file. Please make sure to copy 
      the appropriate variable from the Plaid dashboard`,
            })
            return
        } else if (typeof plaidConfig !== 'undefined' && config.PLAID_CONFIG.basePath.indexOf('sandbox') < 0) {
            res.json({ status: 'error', errorMessage: 'You\'re using a non-sandbox environment in a publicly-accessible URL that has no real sign-in system and anybody can access your user\'s info. This is probably a terrible idea.' })
            return
        } else {
            res.json({ status: 'ready' })
        }
    } catch (error) {
        console.log('Got an error: ', error)
    }

})

// Generates a Link token to be used by the client.\
plaidrouter.post('/generate_link_token', async (req, res, next) => {
    const { username } = req.body
    try {
        const linkTokenConfig = {
            user: { client_user_id: username },
            client_name: 'Florin Finances',
            language: 'en',
            products: ['auth', 'transactions'],
            country_codes: ['CA'],
            webhook: 'https://www.example.com/webhook',
        }
        const tokenResponse = await plaidClient.linkTokenCreate(linkTokenConfig)
        const tokenData = tokenResponse.data
        res.json(tokenData)
    } catch (error) {
        console.log(
            'Running into an error! Note that if you have an error when creating a ' +
            'link token, it\'s frequently because you have the wrong client_id ' +
            'or secret for the environment, or you forgot to copy over your ' +
            '.env.template file to.env.'
        )
        next(error)
    }
})

// Swap the public token for an access token, so we can access account info in the future
plaidrouter.post('/swap_public_token', async (request, res, next) => {
    try {
        const response = await plaidClient.itemPublicTokenExchange({
            public_token: request.body.public_token,
        })
        console.log(request.body.public_token)
        if (response.data !== null && response.data.access_token !== null) {
            res.json({
                status: 'success', accessToken: response.data.access_token
            })
        }
    } catch (error) {
        next(error)
    }
})

// Just grabs the results for calling item/get. Useful for debugging purposes
plaidrouter.post('/get_item_info', async (request, res, next) => {
    console.log('AT: ', request.body)
    try {
        const itemResponse = await plaidClient.itemGet({
            access_token: request.body.accessToken,
        })
        res.json(itemResponse.data)
    } catch (error) {
        next(error)
    }
})

// Just grabs the results for calling accounts/get. Useful for debugging purposes
plaidrouter.post('/get_accounts_info', async (request, res, next) => {
    console.log('AT: ', request.body)
    try {
        const accountResult = await plaidClient.accountsGet({
            access_token: request.body.accessToken,
        })
        res.json(accountResult.data)
    } catch (error) {
        next(error)
    }
})

// Get Auth Details
plaidrouter.post('/auth/get', async (request, res, next) => {
    console.log('Get Auth Details Request: ', request.body)
    console.log('Access_Token: ', request.body.access_token)
    try {
        // Call the Plaid API to get auth details
        const authResult = await plaidClient.authGet({
            access_token: request.body.access_token,
            client_id: process.env.PLAID_CLIENT_ID,
            secret: process.env.PLAID_SECRET,
        })

        // Handle the response and send it as JSON
        res.json(authResult.data)
    } catch (error) {
        next(error)
    }
})

// Get Balance Info
plaidrouter.post('/accounts/balance/get', async (request, res, next) => {
    console.log('Balances: ', request.body)
    try {
        const balanceResult = await plaidClient.accountsBalanceGet({
            access_token: request.body.access_token,
            //account_id: request.body.accountId, // Replace 'accountId' with the actual property name containing the account_id
            client_id: process.env.PLAID_CLIENT_ID,
            secret: process.env.PLAID_SECRET,
        })
        res.json(balanceResult.data)
    } catch (error) {
        next(error)
    }
})

// Get Transactions by Incremental Updates
plaidrouter.post('/transactions/sync', async (request, res, next) => {
    console.log('Sync Transactions Request: ', request.body)
    try {
        // Call the Plaid API to sync transactions
        const syncResult = await plaidClient.transactionsSync({
            access_token: request.body.access_token,
            count: request.body.count,
            client_id: process.env.PLAID_CLIENT_ID,
            secret: process.env.PLAID_SECRET,
        })
        res.json(syncResult.data)
    } catch (error) {
        next(error)
    }
})

// Get Transactions by Date Range
plaidrouter.post('/transactions/get', async (request, res, next) => {
    console.log('Get Transactions Request: ', request.body)
    try {
    // Call the Plaid API to get transactions
        const transactionsResult = await plaidClient.transactionsGet({
            access_token: request.body.access_token,
            start_date: request.body.start_date,
            end_date: request.body.end_date,
            client_id: process.env.PLAID_CLIENT_ID,
            secret: process.env.PLAID_SECRET,
        })
        // Handle the response and send it as JSON
        res.json(transactionsResult.data)
    } catch (error) {
        next(error)
    }
})

module.exports = plaidrouter