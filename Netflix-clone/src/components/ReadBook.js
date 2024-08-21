import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import './ReadBook.css'; // Vamos criar este arquivo CSS para os ajustes
import bookApi from '../bookApi';

const ReadBook = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
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
        <div className="read-book-container">
            <DocViewer
                documents={[{ uri: book.pdfUrl }]}
                pluginRenderers={DocViewerRenderers}
                config={{
                    header: {
                        disableHeader: false,
                        disableFileName: true,
                        retainURLParams: false,
                    },
                    pdfZoom: {
                        defaultZoom: 1.1, // Zoom padrão ajustado para mobile
                        zoomJump: 0.2,
                    },
                    pdfVerticalScrollByDefault: true, // Rolagem vertical padrão
                }}
            />
        </div>
    );
};

export default ReadBook;
