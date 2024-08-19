import React from 'react';
import './Header.css';
import bookflixLogo from './bookflix.png';
import { useNavigate } from 'react-router-dom';

const Header = ({ black, setIsAuthenticated }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        setIsAuthenticated(false); // Deslogar o usuário
        navigate('/login'); // Redirecionar para a página de login
    };

    return (
        <header className={black ? 'black' : ''}>
            <div className="logo">
                <a href="/">
                    <img src={bookflixLogo} alt="bookflix" />
                </a>
            </div>
            <div className="user">
                <button onClick={handleLogout} className="logout-button">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="UserImage" />
                </button>
            </div>
        </header>
    );
};

export default Header;
