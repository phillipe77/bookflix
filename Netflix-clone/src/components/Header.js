import React, { useEffect, useState, useCallback } from 'react';
import './Header.css';
import bookflixLogo from './bookflix.png';

const Header = ({ onLogout }) => {
    const [black, setBlack] = useState(false);

    // Função para monitorar a rolagem da página e ajustar a cor do cabeçalho
    const handleScroll = useCallback(() => {
        if (window.scrollY > 15) {
            setBlack(true);
        } else {
            setBlack(false);
        }
    }, []);

    // Adicionar e remover listener de rolagem
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    return (
        <header className={black ? 'black' : ''}>
            <div className="logo">
                <a href="/">
                    <img src={bookflixLogo} alt="bookflix" />
                </a>
            </div>
            <div className="user" onClick={onLogout}>
                <button className="logout-button">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="UserImage" />
                </button>
            </div>
        </header>
    );
};

export default Header;
