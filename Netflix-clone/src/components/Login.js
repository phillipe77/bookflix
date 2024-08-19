import React, { useState } from 'react';
import './Login.css';
import bookflixLogo from './bookflix.png'; // Use o seu logotipo

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulação de autenticação simples
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
                <form onSubmit={handleSubmit} className="login-form">
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        className="login-input"
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="login-input"
                    />
                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
