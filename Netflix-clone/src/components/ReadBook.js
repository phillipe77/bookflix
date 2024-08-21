import React, { useState, useEffect, useCallback } from 'react';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { useParams, useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';  // Importa a biblioteca de swipe
import bookApi from '../bookApi';
import _ from 'lodash';
import './ReadBook.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

const ReadBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [zoom, setZoom] = useState(0.8); // Estado para controlar o zoom
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

    const handleZoomChange = (newZoom) => {
        setZoom(newZoom);
    };

    // Função de debounce para aplicar o zoom
    const debouncedZoom = _.debounce(handleZoomChange, 300);

    // Handlers de Swipe
    const handleSwipeLeft = () => {
        // Incrementa a página, se possível
        if (book && currentPage < book.totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handleSwipeRight = () => {
        // Decrementa a página, se possível
        if (book && currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    // Configura os gestures de swipe
    const swipeHandlers = useSwipeable({
        onSwipedLeft: handleSwipeLeft,
        onSwipedRight: handleSwipeRight,
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
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
        <div className="pdf-viewer-container" {...swipeHandlers}>
            <div className="logo-container" onClick={() => navigate('/')}>
                <img src="/logo192.png" alt="Logos" className="logo-icon" />
            </div>

            <DocViewer
                documents={[{ uri: book.pdfUrl }]}
                pluginRenderers={DocViewerRenderers}
                config={{
                    header: {
                        disableHeader: true,
                    },
                    pdfZoom: {
                        defaultZoom: zoom,
                        zoomJump: 0.3,
                    },
                    pdfVerticalScrollByDefault: true,
                    disableTextLayer: true,
                }}
                style={{
                    width: '100%',
                    height: '100vh',
                    maxWidth: '794px',
                    maxHeight: '1122px',
                    margin: '0 auto',
                    backgroundColor: '#f5f5f5',
                    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
                    overflowY: 'auto',
                }}
                onZoom={(newZoom) => debouncedZoom(newZoom)}
                requestHeaders={{ timeout: 10000 }}
            />
        </div>
    );
};

export default ReadBook;
