import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import bookApi from '../bookApi';
import { Viewer, Worker, ScrollMode, ViewMode } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import './BookDetails.css';

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        toolbarPlugin: {
            // Customize the toolbar to remove the "open" button
            renderToolbar: (Toolbar) => (
                <Toolbar>
                    {(props) => {
                        const { Download, Print, Search, ZoomIn, ZoomOut, PageNumber, GoToPreviousPage, GoToNextPage, GoToFirstPage, GoToLastPage } = props;
                        return (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <GoToFirstPage />
                                    <GoToPreviousPage />
                                    <PageNumber />
                                    <GoToNextPage />
                                    <GoToLastPage />
                                    <ZoomOut />
                                    <ZoomIn />
                                    <Search />
                                    <Print />
                                    <Download />
                                    {/* Removendo o botão de Upload/Open */}
                                    {/* <Open /> */}
                                </div>
                            </>
                        );
                    }}
                </Toolbar>
            ),
        },
    });

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const bookData = await bookApi.getBookInfo(id);
                setBook(bookData);
                setLoading(false);
            } catch (err) {
                setError('Erro ao buscar informações do livro');
                setLoading(false);
            }
        };

        fetchBook();
    }, [id]);

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!book) {
        return <div>Livro não encontrado!</div>;
    }

    return (
        <div className="book-details">
            <div className="book-info">
                <img src={book.coverUrl} alt={book.title} className="book-cover" />
                <h1>{book.title}</h1>
                <p><strong>Autor:</strong> {book.author}</p>
                <p><strong>Descrição:</strong> {book.description}</p>
                <p><strong>Categoria:</strong> {book.category}</p>
            </div>
            <div className="pdf-viewer-section">
                <h2>Leia o Livro:</h2>
                <div className="pdf-viewer-container">
                    <div className="pdf-viewer">
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                            <Viewer
                                fileUrl={book.pdfUrl}
                                defaultScale={1.0}
                                scrollMode={ScrollMode.Vertical}
                                viewMode={ViewMode.SinglePage}
                                plugins={[defaultLayoutPluginInstance]}
                                theme="dark"
                            />
                        </Worker>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;
