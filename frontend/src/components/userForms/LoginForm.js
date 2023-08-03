import { useState } from 'react'
import realQR from './realQR.png'

const LoginForm = ({ login, direct_to_register }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()
        await login(username, password)
    }
    return(
        <div className="login_box">
            <div className="login_left">
                <form  onSubmit={handleSubmit}>
                    <label className="title"><span>Login</span></label>
                    <div className="input_box">
                        <input id='username' className="form-control"
                            placeholder="Username"
                            value={username}
                            onChange={({ target }) => setUsername(target.value)}
                        />
                        <input
                            id='password'
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            value={password}
                            onChange={({ target }) => setPassword(target.value)}
                        />
                        <button className="loginButton" type="submit">
                            Login
                        </button>
                    </div>
                </form>
            </div>
            <div className="login_right">
                <div className="register_box">
                    <span className="register">Register Here</span>
                </div>
                <div className="QRcode">
                    <img className="QRImage" src={realQR} alt="QR Code"/>
                </div>
                <div className="action_container">
                    <span><a onClick={direct_to_register}>Register</a></span>
                </div>
            </div>
        </div>

    )
}

export default LoginForm