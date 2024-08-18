// src/components/MV.js
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import './MV.css'; 

const MV = ({ title, items }) => {
    const listRef = useRef(null);

    const scrollLeft = () => {
        listRef.current.scrollBy({
            left: -300, // Ajuste o valor para controlar a distância de rolagem
            behavior: 'smooth'
        });
    };

    const scrollRight = () => {
        listRef.current.scrollBy({
            left: 300, // Ajuste o valor para controlar a distância de rolagem
            behavior: 'smooth'
        });
    };

    return (
        <div className='MV'>
            <h2>{title}</h2>
            <div className="MV--listarea">
                <button className="carousel-nav left-nav" onClick={scrollLeft}>&lt;</button>
                <div className="MV--list" ref={listRef}>
                    {items.length > 0 && items.map((item, key) => (
                        <div key={key} className="MV--item">
                            <Link to={`/book/${item._id}`}>
                                <img src={item.coverUrl} alt={item.title} />
                            </Link>
                        </div>
                    ))}
                </div>
                <button className="carousel-nav right-nav" onClick={scrollRight}>&gt;</button>
            </div>
        </div>
    );
};

export default MV;
