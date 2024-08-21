import React, { useState, useEffect } from 'react';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { useParams, useNavigate } from 'react-router-dom';
import bookApi from '../bookApi';
import './ReadBook.css';

const ReadBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        const fetchBook = async () => {
            try {
                const bookData = await bookApi.getBookInfo(id);
                if (bookData && bookData.pdfUrl) {
                    setBook(bookData);
                } else {
                    throw new Error("Informações do livro estão incompletas.");
                }
            } catch (err) {
                setError('Erro ao buscar informações do livro');
            }
        };

        fetchBook();

        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, [id]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!book) {
        return <div>Livro não encontrado!</div>;
    }

    return (
        <div className="pdf-viewer-container">
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
                        defaultZoom: isMobile ? 0.9 : 1.0, // Zoom padrão para mobile
                        zoomJump: 0.1,
                    },
                    pdfVerticalScrollByDefault: true,
                }}
                style={{
                    width: isMobile ? '100%' : '100%', // Responsivo para mobile
                    height: isMobile ? '100vh' : '100vh',
                    maxWidth: isMobile ? '100%' : '794px',
                    maxHeight: isMobile ? 'auto' : '1122px',
                    margin: '0 auto',
                    backgroundColor: '#f5f5f5',
                    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
                    overflowY: isMobile ? 'scroll' : 'auto', // Usar scroll para mobile
                }}
            />
        </div>
    );
};

export default ReadBook;
