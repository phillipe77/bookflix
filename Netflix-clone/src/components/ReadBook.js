import React, { useState, useEffect } from 'react';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { useParams } from 'react-router-dom';
import bookApi from '../bookApi';
import './ReadBook.css';

const ReadBook = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
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
    }, [id]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!book) {
        return <div>Livro não encontrado!</div>;
    }

    return (
        <div className="pdf-viewer-container">
            <DocViewer
                documents={[{ uri: book.pdfUrl }]}
                pluginRenderers={DocViewerRenderers}
                config={{
                    header: {
                        disableHeader: true,
                    },
                    pdfZoom: {
                        defaultZoom: 0.75,
                        zoomJump: 0.1,
                    },
                    pdfVerticalScrollByDefault: true, // Habilita a rolagem vertical por padrão
                }}
                style={{
                    width: '100%',
                    height: '100vh',
                    maxWidth: '794px',  // Largura de uma folha A4 em pixels
                    maxHeight: '1122px',  // Altura de uma folha A4 em pixels
                    margin: '0 auto',
                    backgroundColor: '#f5f5f5',
                    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
                    overflowY: 'auto',  // Garante a rolagem vertical
                }}
            />
        </div>
    );
};

export default ReadBook;
