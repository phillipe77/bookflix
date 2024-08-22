import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
    const [zoom, setZoom] = useState(1.0);
    const [logoSrc, setLogoSrc] = useState('/logo192.png');

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

    useEffect(() => {
        const updateLogo = () => {
            if (window.innerWidth <= 768) {
                setLogoSrc('/logo512.png');
            } else {
                setLogoSrc('/logo192.png');
            }
        };

        updateLogo();
        window.addEventListener('resize', updateLogo);

        return () => window.removeEventListener('resize', updateLogo);
    }, []);

    const handleRetry = useCallback(() => {
        setLoading(true);
        setError(null);
        fetchBook();
    }, [fetchBook]);

    const handleZoomChange = useCallback((newZoom) => {
        setZoom(newZoom);
    }, []);

    const debouncedZoom = useMemo(
        () => _.debounce(handleZoomChange, 500),
        [handleZoomChange]
    );

    const memoizedBook = useMemo(() => book, [book]);

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

    if (!memoizedBook) {
        return <div>Livro não encontrado!</div>;
    }

    return (
        <div className="readbook-container">
            <div className="sidebar">
                <h2>Sumário</h2>
                <ul>
                    <li>Capítulo 1</li>
                    <li>Capítulo 2</li>
                    <li>Capítulo 3</li>
                </ul>
            </div>

            <div className="pdf-viewer-container">
                <div className="logo-container" onClick={() => navigate('/')}>
                    <img src={logoSrc} alt="Logos" className="logo-icon" />
                </div>

                <DocViewer
                    documents={[{ uri: memoizedBook.pdfUrl }]}
                    pluginRenderers={DocViewerRenderers}
                    config={{
                        header: {
                            disableHeader: true,
                        },
                        pdfZoom: {
                            defaultZoom: zoom,
                            zoomJump: 0.2,
                        },
                        pdfVerticalScrollByDefault: false, // Modificação para scroll horizontal
                        disableTextLayer: true,
                        pdfDisplayMode: 'dual', // Mostra duas páginas lado a lado
                    }}
                    style={{
                        width: '100%',
                        height: '100vh',
                        maxWidth: '1500px', // Aumentado para duas páginas
                        margin: '0 auto',
                        backgroundColor: '#f5f5f5',
                        boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
                        overflowX: 'auto', // Modificação para scroll horizontal
                    }}
                    onZoom={(newZoom) => debouncedZoom(newZoom)}
                    requestHeaders={{ timeout: 20000 }}
                />
            </div>
        </div>
    );
};

export default React.memo(ReadBook);
