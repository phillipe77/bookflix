// src/components/Login.js
import React, { useState } from 'react';
import './Login.css';
import bookflixLogo from './bookflix.png';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (event) => {
        event.preventDefault();
        // Simulação de autenticação
        if (email === 'user@example.com' && password === 'password') {
            setIsAuthenticated(true);
            navigate('/'); // Redireciona para a página principal após o login
        } else {
            alert('Credenciais inválidas');
        }
    };

    return (
        <div className="login-container">
            <div className="login-logo">
                <img src={bookflixLogo} alt="Logos" />
            </div>
            <form onSubmit={handleLogin}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Senha" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
