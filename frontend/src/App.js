import { useState, useEffect } from 'react'
import loginService from './services/login'
import storageService from './services/storage'

import LoginForm from './components/LoginForm'
import Notification from './components/Notification'

const App = () => {
    const [user, setUser] = useState('')
    const [info, setInfo] = useState({ message: null })

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

    if (!user) {
        return (
            <div>
                <h1>Florin Finances</h1>
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
                <button className="btn btn-primary" onClick={logout}>Logout</button>
            </div>
        </div>
    )
}

export default App

