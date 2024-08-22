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
    const [logoSrc, setLogoSrc] = useState('/logo192.png'); // Estado para a logo

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
        // Detecta o tamanho da tela e ajusta a logo
        const updateLogo = () => {
            if (window.innerWidth <= 768) {
                setLogoSrc('/logo512.png'); // Usa logo512.png para dispositivos móveis
            } else {
                setLogoSrc('/logo192.png'); // Usa logo192.png para dispositivos desktop
            }
        };

        updateLogo(); // Atualiza logo ao montar o componente
        window.addEventListener('resize', updateLogo); // Atualiza logo ao redimensionar a tela

        return () => window.removeEventListener('resize', updateLogo); // Limpa o evento ao desmontar
    }, []);

    const handleRetry = useCallback(() => {
        setLoading(true);
        setError(null);
        fetchBook();
    }, [fetchBook]);

    const handleZoomChange = useCallback((newZoom) => {
        setZoom(newZoom);
    }, []);

    // Memoize the debounced function to avoid unnecessary re-creations
    const debouncedZoom = useMemo(
        () => _.debounce(handleZoomChange, 500),
        [handleZoomChange]
    );

    // Memoize the book object to avoid unnecessary re-renders
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
                requestHeaders={{ timeout: 20000 }}
            />
        </div>
    );
};

export default React.memo(ReadBook);
