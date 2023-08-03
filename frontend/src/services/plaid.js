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

const authGet = async (accessToken) => {
    const body = {
        access_token: accessToken
    }
    // console.log(body)
    const ret = await axios.post('api/plaid/auth/get', body)
    console.log(ret.data)
    showOutput(JSON.stringify(ret))
}

const balanceGet = async (accessToken) => {
    const body = {
        access_token: accessToken
    }

    const ret = await axios.post('/api/plaid/accounts/balance/get', body)
    // console.log(ret.data.accounts)
    // showOutput(JSON.stringify(ret))
    return ret.data.accounts
}

const transactionsSync = async (accessToken, count) => {
    const body = {
        access_token: accessToken,
        count: count
    }

    const ret = await axios.post('/api/plaid/transactions/sync', body)
    console.log(ret.data)
    showOutput(JSON.stringify(ret))
}

const transactionsGet = async (accessToken, start_date, end_date) => {
    const body = {
        access_token: accessToken,
        start_date: start_date,
        end_date: end_date,
    }

    const ret = await axios.post('/api/plaid/transactions/get', body)
    // console.log(ret.data)
    // showOutput(JSON.stringify(ret))
    return ret.data.transactions
}

runPrecheck()

export default {
    exchangeToken,
    getAccountsInfo,
    getItemInfo,
    authGet,
    balanceGet,
    transactionsSync,
    transactionsGet,
}