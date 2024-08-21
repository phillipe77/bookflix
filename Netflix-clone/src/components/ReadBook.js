import React, { useState, useEffect, useCallback } from 'react';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { useParams, useNavigate } from 'react-router-dom';
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
    const [zoom, setZoom] = useState(0.9); 

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

    const debouncedZoom = _.debounce(handleZoomChange, 300);

    const handleTouchStart = (event) => {
        const touch = event.touches[0];
        const screenWidth = window.innerWidth;
        const touchX = touch.clientX;

        console.log(`Touch detected at position: ${touchX}px`);

        if (touchX > screenWidth * 0.8) {
            console.log("Touch on the right side, moving to next page.");
            goToNextPage();
        } else if (touchX < screenWidth * 0.2) {
            console.log("Touch on the left side, moving to previous page.");
            goToPreviousPage();
        }
    };

    const goToNextPage = () => {
        const nextButton = document.querySelector(".btn-next");
        if (nextButton) {
            console.log("Next button found, triggering click.");
            nextButton.click();
        } else {
            console.log("Next button not found.");
        }
    };

    const goToPreviousPage = () => {
        const prevButton = document.querySelector(".btn-prev");
        if (prevButton) {
            console.log("Previous button found, triggering click.");
            prevButton.click();
        } else {
            console.log("Previous button not found.");
        }
    };

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
        <div className="pdf-viewer-container" onTouchStart={handleTouchStart}>
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
                        zoomJump: 0.2,
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
