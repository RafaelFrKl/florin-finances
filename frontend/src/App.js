import { useState, useEffect } from 'react'
import { callMyServer, showOutput } from './services/plaidUtils.js'
import { usePlaidLink } from 'react-plaid-link'
import plaidService from './services/plaid'
import loginService from './services/login'
import storageService from './services/storage'

import LoginForm from './components/LoginForm'
import Modal from './components/Modal'
import Notification from './components/Notification'
import Button from './components/Button.js'

const App = () => {
    const [user, setUser] = useState('')
    const [info, setInfo] = useState({ message: null })

    //Plaid Token Data
    const [linkTokenData, setLinkTokenData] = useState('')
    const [publicTokenToExchange, setPublicTokenToExchange] = useState('')
    const [accessToken, setAccessToken] = useState('')

    useEffect(() => {
        const user = storageService.loadUser()
        setUser(user)
    }, [])

    const notifyWith = (message, type='info') => {
        setInfo({
            message, type
        })

        setTimeout(() => {
            setInfo({ message: null } )
        }, 3000)
    }

    const login = async (username, password) => {
        try {
            const user = await loginService.login({ username, password })
            setUser(user)
            storageService.saveUser(user)
            notifyWith(`Welcome ${user.name}!`)
        } catch(e) {
            notifyWith('Wrong Username or Password', 'error')
        }
    }

    const logout = async () => {
        setUser(null)
        storageService.removeUser()
        notifyWith('Logged Out')
    }

    // Initialize link by fetching a link token and storing it as our linkTokenData
    // eslint-disable-next-line no-unused-vars
    const handleInitializeLink = async (event) => {
        setLinkTokenData(await callMyServer('/api/plaid/generate_link_token', true, {
            username: user.username,
        }))
        showOutput(`Received link token data ${JSON.stringify(linkTokenData)}`)
        if (linkTokenData === undefined) {
            return
        }
        console.log('linkToken:', linkTokenData.link_token)
    }

    // Start link using the link token data we have stored
    const { open } = usePlaidLink( {
        token: linkTokenData.link_token,
        onSuccess: (publicToken, metadata) => {
            console.log(`ONSUCCESS: Metadata ${JSON.stringify(metadata)}`)
            showOutput(
                `I have a public token: ${publicToken} I should exchange this`
            )
            setPublicTokenToExchange(publicToken)
        },
        onExit: (err, metadata) => {
            console.log(
                `Exited early. Error: ${JSON.stringify(err)} Metadata: ${JSON.stringify(
                    metadata
                )}`
            )
            showOutput(`Link existed early with status ${metadata.status}`)
        },
        onEvent: (eventName, metadata) => {
            console.log(`Event ${eventName}, Metadata: ${JSON.stringify(metadata)}`)
        },
    })

    const handleExchangeToken = async () => {
        console.log(user)
        const access_Token = await plaidService.exchangeToken(publicTokenToExchange, user.id)
        setAccessToken(access_Token)
    }

    const handleGetAccountsInfo = () => {
        plaidService.getAccountsInfo(accessToken)
    }

    const handleGetItemInfo = () => {
        plaidService.getItemInfo(accessToken)
    }

    if (!user) {
        return (
            <div>
                <div className="d-flex justify-content-between">
                    <h1>Florin Finances</h1>
                    <Modal />
                </div>
                <h2>log in to application</h2>
                <Notification info={info} />
                <LoginForm login={login} />
            </div>
        )
    }

    return (
        <div>
            <h1>Florin Finances</h1>
            <Notification info={info} />
            <div>
                <p>{user.name} logged in</p>
                <Button handleClick={logout} text="Logout" />
                <p>Connect to a bank!</p>
                <Button handleClick={handleInitializeLink} text="Step 1: Start Plaid Link" />
                <Button handleClick={open} text="Step 2: Connect a bank account" />
                <Button handleClick={handleExchangeToken} text="Step 3: Exchange a public token" />
                <p>Basic get my account status functions</p>
                <Button handleClick={handleGetAccountsInfo} text="Get info about my account(s)" />
                <Button handleClick={handleGetItemInfo} text="Get into about my Item" />
                <div>
            Results will go here
                </div>
                <script src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"></script>

            </div>
        </div>
    )
}

export default App

