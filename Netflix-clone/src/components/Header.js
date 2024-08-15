import React from 'react';
import './Header.css';
import bookflixLogo from './bookflix.jpg';

export default ({black}) => {
    return (
        <header className={black ? 'black' : ''}>
            <div className="logo">
                <a href="#">
                    <img src={bookflixLogo} alt="bookflix"/>
                </a>
            </div>
            <div className="user">
                <a href="#">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="UserImage"/>
                </a>
            </div>
        </header>
    );
}