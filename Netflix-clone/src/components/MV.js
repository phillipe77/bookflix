import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MV.css';

const MV = ({ title, items }) => {
    const listRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const { scrollLeft, scrollWidth, clientWidth } = listRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
        };

        handleScroll(); // Para verificar no início
        listRef.current.addEventListener('scroll', handleScroll);

        return () => {
            listRef.current.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLeftClick = () => {
        listRef.current.scrollLeft -= 150;
    };

    const handleRightClick = () => {
        listRef.current.scrollLeft += 150;
    };

    return (
        <div className='MV'>
            <h2>{title}</h2>
            {canScrollLeft && (
                <div className="MV--left" onClick={handleLeftClick}>
                    <img src="/left-arrow.svg" alt="Left" />
                </div>
            )}
            {canScrollRight && (
                <div className="MV--right" onClick={handleRightClick}>
                    <img src="/right-arrow.svg" alt="Right" />
                </div>
            )}
            <div className="MV--listarea" ref={listRef}>
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
