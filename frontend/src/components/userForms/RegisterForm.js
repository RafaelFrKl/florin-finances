import { useState } from 'react'

const RegisterForm = ({ register }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const role = 'user'

    const handleSubmit = async (event) => {
        event.preventDefault()
        await register(username, name, role, password)
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        required
                        className="form-control"
                        placeholder="Name"
                        value={name}
                        onChange={({ target }) => setName(target.value)}
                    />
                    <label>Username</label>
                    <input
                        required
                        className="form-control"
                        placeholder="Username"
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    />
                    <label>Password</label>
                    <input
                        required
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button className="btn btn-primary" type="submit">
                    Create
                </button>
            </form>
        </div>
    )
}

export default RegisterForm