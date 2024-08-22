import React, { useState, useEffect, useCallback } from 'react';
import { Document, Page } from 'react-pdf';
import { useParams, useNavigate } from 'react-router-dom';
import bookApi from '../bookApi';
import './ReadBook.css';

const ReadBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null);
    const [width, setWidth] = useState(window.innerWidth);

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
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handleNextPage = () => {
        if (pageNumber < numPages - 1) {
            setPageNumber(pageNumber + 2);
        }
    };

    const handlePrevPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 2);
        }
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return (
            <div>
                {error}
                <button onClick={fetchBook}>Tentar novamente</button>
            </div>
        );
    }

    if (!book) {
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
                    <img src={width > 768 ? '/logo192.png' : '/logo512.png'} alt="Logos" className="logo-icon" />
                </div>

                <Document
                    file={book.pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="pdf-document"
                >
                    <div className="pdf-page-container">
                        <Page pageNumber={pageNumber} />
                        {pageNumber + 1 <= numPages && (
                            <Page pageNumber={pageNumber + 1} />
                        )}
                    </div>
                </Document>

                <div className="navigation-buttons">
                    <button onClick={handlePrevPage} disabled={pageNumber <= 1}>
                        Anterior
                    </button>
                    <button
                        onClick={handleNextPage}
                        disabled={pageNumber >= numPages - 1}
                    >
                        Próximo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ReadBook);
