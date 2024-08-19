import React, { useState } from 'react';
import './Login.css';
import bookflixLogo from './bookflix.png';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            

            const data = await response.json();

            if (response.ok) {
                // Armazene o token no localStorage
                localStorage.setItem('token', data.token);
                onLogin(true);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            alert('Erro ao tentar fazer login.');
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
