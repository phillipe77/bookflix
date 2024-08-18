import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MV.css';

const MV = ({ title, items }) => {
    const listRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    useEffect(() => {
        const listElement = listRef.current;

        const handleScroll = () => {
            const { scrollLeft, scrollWidth, clientWidth } = listElement;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
        };

        handleScroll(); // Para verificar no início
        listElement.addEventListener('scroll', handleScroll);

        return () => {
            listElement.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLeftClick = () => {
        listRef.current.scrollLeft -= 150;
    };

    const handleRightClick = () => {
        const maxScrollLeft = listRef.current.scrollWidth - listRef.current.clientWidth;
        listRef.current.scrollLeft = Math.min(listRef.current.scrollLeft + 150, maxScrollLeft);
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
