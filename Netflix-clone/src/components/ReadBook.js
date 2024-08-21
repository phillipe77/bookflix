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
                        disableHeader: true, // Desativa o cabeçalho para mais espaço de visualização
                    },
                    pdfZoom: {
                        defaultZoom: 1.0, // Ajuste de zoom padrão para leitura confortável
                        zoomJump: 0.1,
                    },
                    pdfVerticalScrollByDefault: true, // Rolar vertical por padrão no web
                }}
                style={{
                    width: '100%',
                    height: '100vh',
                    overflow: 'hidden', // Evita barra de rolagem branca embaixo
                }}
            />
        </div>
    );
};

export default ReadBook;
