import React, { useState, useEffect, useCallback } from 'react';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { useParams, useNavigate } from 'react-router-dom';
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
    const [zoom, setZoom] = useState(1); // Iniciando zoom em 100%

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

    const handleRetry = useCallback(() => {
        setLoading(true);
        setError(null);
        fetchBook();
    }, [fetchBook]);

    const handleZoomIn = () => {
        setZoom((prevZoom) => Math.min(prevZoom + 0.1, 2)); // Limita o zoom máximo em 200%
    };

    const handleZoomOut = () => {
        setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.5)); // Limita o zoom mínimo em 50%
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

    if (!book || !book.pdfUrl) {
        return <div>Livro não encontrado ou PDF indisponível!</div>;
    }

    return (
        <div className="pdf-viewer-container">
            <div className="logo-container" onClick={() => navigate('/')}>
                <img src="/logo192.png" alt="Logos" className="logo-icon" />
            </div>

            <div className="zoom-controls">
                <button onClick={handleZoomOut}>-</button>
                <button onClick={handleZoomIn}>+</button>
            </div>

            <div
                className="pdf-content"
                style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'center top',
                    transition: 'transform 0.3s ease', // Adiciona uma transição suave para o zoom
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
                            defaultZoom: 1, // Zoom inicial fixo em 100%
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
                />
            </div>
        </div>
    );
};

export default React.memo(ReadBook);
