import React, { useState, useEffect, useCallback } from 'react';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer"; // Certifique-se de que isso esteja incluído
import { useParams, useNavigate } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import bookApi from '../bookApi';
import './ReadBook.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

const ReadBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // Controla a página atual

    const fetchBook = useCallback(async () => {
        try {
            const bookData = await bookApi.getBookInfo(id);
            if (bookData && bookData.pdfUrl) {
                setBook(bookData);
            } else {
                throw new Error("Informações do livro estão incompletas.");
            }
        } catch (err) {
            setError('Erro ao buscar informações do livro');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchBook();
    }, [fetchBook]);

    const handleRetry = () => {
        setLoading(true);
        setError(null);
        fetchBook();
    };

    // Animação para a página
    const [{ x }, set] = useSpring(() => ({ x: 0 }));

    // Gestos de swipe
    const bind = useGesture({
        onDrag: ({ down, movement: [mx], direction: [xDir], distance, cancel }) => {
            if (down && distance > 100) {
                if (xDir > 0 && currentPage > 1) {
                    setCurrentPage(currentPage - 1); // Swipe para a direita
                } else if (xDir < 0 && currentPage < book.totalPages) {
                    setCurrentPage(currentPage + 1); // Swipe para a esquerda
                }
                cancel(); // Cancela o movimento para permitir a transição suave
            }
            set({ x: down ? mx : 0 });
        }
    });

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return (
            <div>
                {error}
                <button onClick={handleRetry}>Tentar novamente</button>
            </div>
        );
    }

    if (!book) {
        return <div>Livro não encontrado!</div>;
    }

    return (
        <div className="pdf-viewer-container">
            <div className="logo-container" onClick={() => navigate('/')}>
                <img src="/logo192.png" alt="Logos" className="logo-icon" />
            </div>

            <animated.div
                {...bind()}
                style={{
                    transform: x.to(x => `translate3d(${x}px,0,0)`),
                    width: '100%',
                    height: '100vh',
                    maxWidth: '794px',
                    maxHeight: '1122px',
                    margin: '0 auto',
                    backgroundColor: '#f5f5f5',
                    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
                    overflowY: 'auto',
                    position: 'relative',
                }}
            >
                <DocViewer
                    documents={[{ uri: book.pdfUrl }]}
                    pluginRenderers={DocViewerRenderers}
                    config={{
                        header: {
                            disableHeader: true,
                        },
                        pdfZoom: {
                            defaultZoom: 0.9,
                            zoomJump: 0.2,
                        },
                        pdfVerticalScrollByDefault: true,
                        disableTextLayer: true,
                        currentPage,
                    }}
                    style={{
                        width: '100%',
                        height: '100%',
                        overflowY: 'auto',
                    }}
                />
            </animated.div>
        </div>
    );
};

export default ReadBook;
