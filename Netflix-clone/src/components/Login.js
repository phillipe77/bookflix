import React, { useState } from 'react';
import './Login.css';
import bookflixLogo from './bookflix.png';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === 'user' && password === 'password') {
            onLogin(true);
        } else {
            alert('Usuário ou senha incorretos');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <img src={bookflixLogo} alt="bookflix" className="login-logo" />
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
