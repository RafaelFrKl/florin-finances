/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { callMyServer, showOutput } from './services/plaidUtils.js'
import { usePlaidLink } from 'react-plaid-link'
import plaidService from './services/plaid'
import loginService from './services/login'
import storageService from './services/storage'
import registerService from './services/register.js'

import Modal from './components/Modal'
import Notification from './components/Notification'
import Button from './components/Button.js'
import LoginForm from './components/userForms/LoginForm'
import RegisterForm from './components/userForms/RegisterForm.js'
import ColumnChart from './components/charts/ColumnChart.js'
import BarChart from './components/charts/BarChart.js'
import PieChart from './components/charts/PieChart.js'
import AccountDisplay from './components/displays/AccountsDisplay.js'
import Admin from './components/admin/Admin.js'
import { TransactionDisplay, StartDateInput, EndDateInput } from './components/displays/TransactionsDisplay.js'

const App = () => {
    const [user, setUser] = useState('')
    const [admin, setAdmin] = useState('')
    const [info, setInfo] = useState({ message: null })
    const [show, setShow] = useState(true)

    //Plaid Token Data
    const [linkTokenData, setLinkTokenData] = useState('')
    const [accessToken, setAccessToken] = useState('')

    const [accounts, setAccounts] = useState([])
    const [transactions, setTransactions] = useState([])

    const currentDateDefault = new Date().toISOString().slice(0, 10) // Get current date in "yyyy-mm-dd" format
    const priorDateDefault = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().slice(0, 10)
    const [startDate, setStartDate] = useState(priorDateDefault)
    const [endDate, setEndDate] = useState(currentDateDefault)

    // Load the accessToken from the user if it exists
    useEffect(() => {
        const user = storageService.loadUser()
        setUser(user)
        if (user && user.accessToken) {
            setAccessToken(user.accessToken)
        }
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

            // check if it's admin account
            if (user.role === 'admin') {
                setAdmin('admin')
            // normal user
            }else{
                setUser(user)
                // Load the accessToken from the user if it exists
                if (user && user.accessToken) {
                    setAccessToken(user.accessToken)
                }
                storageService.saveUser(user)
                notifyWith(`Welcome ${user.name}!`)

                // If accessToken does not exist create linktoken to access Plaid Login
                if (!user.accessToken) {
                    setLinkTokenData(
                        await callMyServer('/api/plaid/generate_link_token', true, {
                            username: user.username,
                        })
                    )
                    showOutput(`Received link token data ${JSON.stringify(linkTokenData)}`)
                    if (linkTokenData === undefined) {
                        return
                    }
                    console.log('linkToken:', linkTokenData.link_token)
                } else {
                    console.log('AccessToken already exists:', accessToken)
                }
            }

        } catch(e) {
            notifyWith('Wrong Username or Password', 'error')
        }
    }

    const logout = async () => {
        setUser(null)
        setAccessToken(null)
        storageService.removeUser()
        window.location.reload()
        notifyWith('Logged Out')
    }

    // logout for admin account
    const admin_logout = async () => {
        setAdmin(null)
        window.location.reload()
        notifyWith('Logged Out')
    }

    const register = async (username, name, role, password) => {
        try {
            await registerService.register({ username, name, role, password })
            notifyWith('Account has been created!')
            switch_login_register()
        } catch(e) {
            notifyWith('Unable to create the account. ' + e.response.data.error, 'error')
        }
    }

    // Start link using the link token data we have stored
    const { open } = usePlaidLink( {
        token: linkTokenData.link_token,
        onSuccess: (publicToken, metadata) => {
            console.log(`ONSUCCESS: Metadata ${JSON.stringify(metadata)}`)
            showOutput(
                `I have a public token: ${publicToken} I should exchange this`
            )
            // setPublicTokenToExchange(publicToken)
            handleExchangeToken(publicToken)
            notifyWith('Connected to Bank Account', 'info')
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

    const handleExchangeToken = async (publicToken) => {
        console.log(user)
        const access_Token = await plaidService.exchangeToken(publicToken, user.id)
        setAccessToken(access_Token)
    }

    const handleGetAccountsInfo = () => {
        plaidService.getAccountsInfo(accessToken)
    }

    const handleGetItemInfo = () => {
        plaidService.getItemInfo(accessToken)
    }

    // switch between the login page and the register page
    const switch_login_register = () => {
        setShow(!show)
    }

    const authGet = () => { plaidService.authGet(accessToken) }

    const balanceGet = async () => {
        const accounts = await plaidService.balanceGet(accessToken)
        setAccounts(accounts)
        // console.log(accounts)
    }

    const transactionsSync = () => { plaidService.transactionsSync(accessToken, 3) }
    const transactionsGet = async () => {
        // hard coded dates
        // const transactions = await plaidService.transactionsGet(accessToken, '2023-04-14', '2024-04-17')
        if (!startDate || !endDate) {
            alert('Please select both start and end dates.')
            return
        }
        const transactions = await plaidService.transactionsGet(accessToken, startDate, endDate)
        setTransactions(transactions)
        console.log(transactions)
    }

    const updateData = () => {
        if (accessToken) {
            balanceGet()
            transactionsGet()
            notifyWith('Data Updated', 'info')
        } else {
            notifyWith('Connect to the bank account first', 'error')
        }
    }

    if (!user) {
        if (admin) {
            return (
                <div>
                    <h2>Admin page</h2>
                    <button className="btn btn-primary" onClick={admin_logout}>
                        Logout
                    </button>
                    <Admin />
                </div>
            )
        }
        if(show){
            return (
                <div>
                    <div className="d-flex justify-content-between">
                        <h1>Florin Finances</h1>
                        <Modal />
                    </div>
                    <Notification info={info} />
                    <div className="loginFormBox"><LoginForm login={login} direct_to_register={switch_login_register}/></div>
                </div>
            )
        }else{
            return (
                <div>
                    <h2>Create account</h2>
                    <Notification info={info} />
                    <button className="btn btn-primary" onClick={switch_login_register}>
                        Back
                    </button>
                    <RegisterForm register={register} />
                </div>
            )
        }
    }
    return (
        <div>
            <h1>Florin Finances</h1>
            <Notification info={info} />
            <div>
                <p>{user.name} logged in</p>
                <Button handleClick={logout} text="Logout" />
                <p>Connect to a bank for AccessToken!</p>
                <Button handleClick={open} text="Connect to Bank" /> <span><Button handleClick={updateData} text = "Update the page" /></span>
                <div>
                    {/* <Button handleClick={updateData} text = "Update the page" /> */}
                    {/* <AccountDisplay accounts={accounts} /> */}
                </div>
                <br></br>
                <br></br>
                <br></br>
                <div className='row'>
                    <div className='col-3'>
                        <AccountDisplay accounts={accounts} />
                        {/* <PieChart transactions={transactions} /> */}
                    </div>
                    <div className='col-3'>
                        <PieChart transactions={transactions} />
                    </div>
                    <div className='col-3'>
                        <ColumnChart transactions={transactions} />
                    </div>
                    <div className='col-3'>
                        <BarChart transactions={transactions} />
                    </div>
                </div>
                <br></br>
                <br></br>
                <br></br>
                <div className='row'>
                    {/* <div className='col-6'>
                        <Button handleClick={updateData} text = "Update the page" />
                        <AccountDisplay accounts={accounts} />
                    </div> */}
                    {/* <div className='col-6'> */}
                    <div className='row'>
                        <div  style={{  display: 'flex', alignItems: 'center' }}>
                            <h2 style={{ marginRight: '10px' }}>Transaction History</h2>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <StartDateInput startDate={startDate} setStartDate={setStartDate} />
                                <EndDateInput endDate={endDate} setEndDate={setEndDate} />
                            </div>
                        </div>
                    </div>
                    <TransactionDisplay data={transactions} />
                </div>
            </div>
            <script src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"></script>

        </div>
        // </div>
    )
}

export default App

