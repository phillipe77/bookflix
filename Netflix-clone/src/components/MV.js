import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import './MV.css';

const MV = ({ title, items }) => {
    const listRef = useRef(null);

    const handleLeftClick = () => {
        listRef.current.scrollLeft -= 150;
    };

    const handleRightClick = () => {
        listRef.current.scrollLeft += 150;
    };

    return (
        <div className='MV'>
            <h2>{title}</h2>
            <div 
                className="MV--listarea" 
                ref={listRef} 
                onMouseEnter={() => listRef.current.parentElement.classList.add('show-arrows')}
                onMouseLeave={() => listRef.current.parentElement.classList.remove('show-arrows')}
            >
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
            <div className="MV--left" onClick={handleLeftClick}>
                <img src="/left-arrow.svg" alt="Left" />
            </div>
            <div className="MV--right" onClick={handleRightClick}>
                <img src="/right-arrow.svg" alt="Right" />
            </div>
        </div>
    );
};

export default MV;
