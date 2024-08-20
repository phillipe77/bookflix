import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import bookApi from '../bookApi';
import { Viewer, Worker, ScrollMode, ViewMode } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { fullScreenPlugin } from '@react-pdf-viewer/full-screen';
import '@react-pdf-viewer/full-screen/lib/styles/index.css';
import { Document, Page, PDFViewer } from '@react-pdf/renderer';
import './BookDetails.css';

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [showMobileViewer, setShowMobileViewer] = useState(false);
    const [numPages, setNumPages] = useState(null);

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        toolbarPlugin: {
            renderToolbar: (Toolbar) => (
                <Toolbar>
                    {(props) => {
                        const { Download, Print, Search, ZoomIn, ZoomOut, PageNumber, GoToPreviousPage, GoToNextPage, GoToFirstPage, GoToLastPage, FullScreen } = props;
                        return (
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
                                <FullScreen />
                            </div>
                        );
                    }}
                </Toolbar>
            ),
        },
    });

    const fullScreenPluginInstance = fullScreenPlugin();

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const bookData = await bookApi.getBookInfo(id);
                if (bookData && bookData.pdfUrl) {
                    setBook(bookData);
                } else {
                    throw new Error("Informações do livro estão incompletas.");
                }
                setLoading(false);
            } catch (err) {
                setError('Erro ao buscar informações do livro');
                setLoading(false);
            }
        };

        fetchBook();
    }, [id]);

    const handleComputerView = () => {
        setShowPdfViewer(true);
    };

    const handleMobileView = () => {
        setShowMobileViewer(true);
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!book) {
        return <div>Livro não encontrado!</div>;
    }

    // Documento PDF customizado para mobile
    const MyDocument = () => (
        <Document
            file={book.pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
        >
            {Array.from(new Array(numPages), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
        </Document>
    );

    return (
        <div className="book-details">
            <div className="book-info">
                <img src={book.coverUrl} alt={book.title} className="book-cover" />
                <h1>{book.title}</h1>
                <p><strong>Autor:</strong> {book.author}</p>
                <p><strong>Descrição:</strong> {book.description}</p>
                <p><strong>Categoria:</strong> {book.category}</p>
            </div>
            <div className="view-buttons">
                <button onClick={handleComputerView} className="view-button">Leitura no Computador</button>
                <button onClick={handleMobileView} className="view-button">Leitura no Celular</button>
            </div>
            {showPdfViewer && (
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
                                    plugins={[defaultLayoutPluginInstance, fullScreenPluginInstance]}
                                    theme="dark"
                                />
                            </Worker>
                        </div>
                    </div>
                </div>
            )}
            {showMobileViewer && (
                <div className="pdf-viewer-section">
                    <PDFViewer style={{ width: '100%', height: '100vh' }}>
                        <MyDocument />
                    </PDFViewer>
                </div>
            )}
        </div>
    );
};

export default BookDetails;
