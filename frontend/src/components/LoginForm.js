import { useState } from 'react'

const LoginForm = ({ login }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()
        await login(username, password)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Username</label>
                <input
                    id='username'
                    className="form-control"
                    placeholder="Username"
                    value={username}
                    onChange={({ target }) => setUsername(target.value)}
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    id='password'
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                />
            </div>
            <button className="btn btn-primary" type="submit">
                Login
            </button>
        </form>
    )
}

export default LoginForm