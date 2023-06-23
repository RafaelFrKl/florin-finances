import axios from 'axios'
import { callMyServer, showOutput } from './plaidUtils.js'

const exchangeToken = async (publicTokenToExchange, id) => {
    const result = await callMyServer('/api/plaid/swap_public_token', true, {
        public_token: publicTokenToExchange,
    })
    console.log('Done exchanging our token. I\'ll re-fetch our status')
    console.log(result)

    // Save hashed accessToken to User in DB
    console.log(result.accessToken)
    const body = {
        accessToken: result.accessToken
    }
    const request = await axios.patch(`api/users/${id}`, body)
    console.log(request)
    return result.accessToken
}

// Get information about the account(s) we're connected to
const getAccountsInfo = async (accessToken) => {
    console.log(accessToken)
    const body = {
        accessToken: accessToken
    }
    console.log(body)
    const accountsData = await axios.post('/api/plaid/get_accounts_info', body)
    console.log(accountsData.data)
    showOutput(JSON.stringify(accountsData))
}

// Get information about the Item we're connected to
const getItemInfo = async (accessToken) => {
    console.log(accessToken)
    const body = {
        accessToken: accessToken
    }
    console.log(body)
    const itemData = await axios.post('api/plaid/get_item_info', body)
    console.log(itemData.data)
    showOutput(JSON.stringify(itemData))
}

const runPrecheck = async function () {
    const Status = await callMyServer('/api/plaid/run_precheck')
    if (Status.status === 'error') {
        showOutput(Status.errorMessage)
    } else {
        showOutput('Plaid is Connected')
    }
}

runPrecheck()

export default {
    exchangeToken,
    getAccountsInfo,
    getItemInfo,
}