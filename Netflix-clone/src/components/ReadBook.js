import React, { useState, useEffect, useCallback } from 'react';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { useParams, useNavigate } from 'react-router-dom';
import bookApi from '../bookApi';
import _ from 'lodash'; // Importando lodash para utilizar throttle
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

    // Função de throttle para aplicar o zoom
    const throttledZoom = _.throttle(handleZoomChange, 300);

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

            {/* Adicionando controles de navegação */}
            <div className="controls">
                {/* Coloque aqui os botões de controle, como zoom, rotação etc. */}
                <button onClick={() => throttledZoom(zoom + 0.1)}>Zoom In</button>
                <button onClick={() => throttledZoom(zoom - 0.1)}>Zoom Out</button>
                {/* Adicione botões de rotação ou outros controles conforme necessário */}
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
                    overflowX: 'auto',  /* Permite rolagem horizontal */
                }}
                onZoom={(newZoom) => throttledZoom(newZoom)} // Aplicando throttle no zoom
                requestHeaders={{ timeout: 10000 }}
            />
        </div>
    );
};

export default ReadBook;
