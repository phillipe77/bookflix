import React from 'react';
import './Header.css';
import bookflixLogo from './bookflix.jpg';

const Header = ({ black }) => {
    return (
        <header className={black ? 'black' : ''}>
            <div className="logo">
                <button onClick={() => window.location.href = '/'}>
                    <img src={bookflixLogo} alt="bookflix" />
                </button>
            </div>
            <div className="user">
                <button onClick={() => window.location.href = '/'}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="UserImage" />
                </button>
            </div>
        </header>
    );
};

export default Header;
