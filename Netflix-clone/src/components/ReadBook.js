import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { useParams, useNavigate } from 'react-router-dom';
import bookApi from '../bookApi';
import _ from 'lodash';
import './ReadBook.css';

const ReadBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [zoom, setZoom] = useState(1.0);
    const [currentPage, setCurrentPage] = useState(0); // Página atual
    const [totalPages, setTotalPages] = useState(0); // Total de páginas

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

    const handleZoomChange = useCallback((newZoom) => {
        setZoom(newZoom);
    }, []);

    const debouncedZoom = useMemo(
        () => _.debounce(handleZoomChange, 500),
        [handleZoomChange]
    );

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

            <div className="doc-viewer-wrapper">
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
                        disableTextLayer: true,
                        pdfRenderAsync: true,
                        disableScroll: true,  // Disable scrolling to implement pagination
                    }}
                    style={{
                        width: '100%',
                        height: '100vh',
                        display: 'flex',
                        flexDirection: 'row',
                        overflow: 'hidden',
                    }}
                    onZoom={(newZoom) => debouncedZoom(newZoom)}
                    onDocumentLoad={(document) => setTotalPages(document.numPages)}
                    onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
                />

                <div className="pagination-controls">
                    <button
                        className="nav-button"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                        disabled={currentPage === 0}
                    >
                        {'<'}
                    </button>
                    <button
                        className="nav-button"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 2, totalPages - 1))}
                        disabled={currentPage >= totalPages - 2}
                    >
                        {'>'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ReadBook);
