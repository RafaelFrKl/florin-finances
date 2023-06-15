import { useState, useEffect } from 'react'
import loginService from './services/login'
import storageService from './services/storage'

import LoginForm from './components/Login'
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
            notifyWith('welcome!')
        } catch(e) {
            notifyWith('wrong username or password', 'error')
        }
    }

    const logout = async () => {
        setUser(null)
        storageService.removeUser()
        notifyWith('logged out')
    }

    if (!user) {
        return (
            <div>
                <h2>log in to application</h2>
                <Notification info={info} />
                <LoginForm login={login} />
            </div>
        )
    }

    return (
        <div>
            <h2>blogs</h2>
            <Notification info={info} />
            <div>
                {user.name} logged in
                <button onClick={logout}>logout</button>
            </div>
        </div>
    )
}

export default App

