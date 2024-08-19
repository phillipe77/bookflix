// src/components/MV.js
import React from 'react';
import { Link } from 'react-router-dom';
import './MV.css'; 

const MV = ({ title, items }) => {
    return (
        <div className='MV'>
            <h2>{title}</h2>
            <div className="MV--listarea">
                <div className="MV--list">
                    {items.length > 0 && items.map((item, key) => (
                        <div key={key} className="MV--item">
                            <Link to={`/book/${item._id}`}>
                                <img src={item.coverUrl} alt={item.title} />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MV;
