import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './MV.css';

const MV = React.memo(({ title, items }) => {
    const listRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const touchStartXRef = useRef(0); // Ref para armazenar a posição inicial do toque

    useEffect(() => {
        const listElement = listRef.current;

        const updateScrollState = () => {
            const { scrollLeft, scrollWidth, clientWidth } = listElement;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
        };

        updateScrollState();
        listElement.addEventListener('scroll', updateScrollState);

        return () => {
            listElement.removeEventListener('scroll', updateScrollState);
        };
    }, []);

    const handleLeftClick = useCallback(() => {
        listRef.current.scrollLeft -= 300;
    }, []);

    const handleRightClick = useCallback(() => {
        const maxScrollLeft = listRef.current.scrollWidth - listRef.current.clientWidth;
        listRef.current.scrollLeft = Math.min(listRef.current.scrollLeft + 300, maxScrollLeft);
    }, []);

    // Funções para lidar com os eventos de toque
    const handleTouchStart = useCallback((event) => {
        touchStartXRef.current = event.touches[0].clientX;
    }, []);

    const handleTouchMove = useCallback((event) => {
        const touchMoveX = event.touches[0].clientX;
        const touchDiff = touchStartXRef.current - touchMoveX;
        listRef.current.scrollLeft += touchDiff * 2; // Multiplica a diferença para aumentar a sensibilidade
        touchStartXRef.current = touchMoveX;
    }, []);

    // Função para lidar com erros de carregamento de imagens
    const handleImageError = (e, coverUrl) => {
        e.target.src = coverUrl; // Substitui a imagem por uma URL de fallback
    };

    return (
        <div className='MV'>
            <h2>{title}</h2>
            <div className="MV--listarea" ref={listRef}>
                <div className="MV--list">
                    {items.length > 0 && items.map((item, key) => (
                        <div key={key} className="MV--item">
                            <Link to={`/book/${item._id}`}>
                                <img 
                                    src={item.coverUrl} 
                                    alt={item.title} 
                                    onError={(e) => handleImageError(e, item.coverUrl)} 
                                />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
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
        </div>
    );
});

export default MV;
