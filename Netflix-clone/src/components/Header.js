import React from 'react';
import './Header.css';
import bookflixLogo from './bookflix.png';

const Header = ({ black, onLogout }) => {
    return (
        <header className={black ? 'black' : ''}>
            <div className="logo">
                <a href="/">
                    <img src={bookflixLogo} alt="bookflix" />
                </a>
            </div>
            <div className="user">
                <a href="/" onClick={onLogout}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="UserImage" />
                </a>
            </div>
        </header>
    );
};

export default Header;
