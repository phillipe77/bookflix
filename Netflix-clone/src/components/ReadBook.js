import React from 'react';
import { useParams } from 'react-router-dom';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import '@cyntler/react-doc-viewer/dist/index.css';
import './ReadBook.css';  // Estilização específica para o leitor
import bookApi from '../bookApi';

const ReadBook = () => {
    const { id } = useParams();
    const [book, setBook] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
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
        <div className="pdf-reader">
            <DocViewer
                documents={[{ uri: book.pdfUrl }]}
                pluginRenderers={DocViewerRenderers}
                config={{
                    pdfZoom: {
                        defaultZoom: 1.1,
                        zoomJump: 0.2,
                    },
                    header: {
                        disableHeader: false,
                        disableFileName: true,
                    },
                    theme: {
                        primary: "#444",
                        secondary: "#ffffff",
                        tertiary: "#eeeeee",
                        textPrimary: "#000000",
                        textSecondary: "#333333",
                        textTertiary: "#666666",
                    },
                }}
            />
        </div>
    );
};

export default ReadBook;
