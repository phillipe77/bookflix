import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookApi from '../bookApi';
import './BookDetails.css';

const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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

    const handleReadNow = () => {
        if (book && book.pdfUrl) {
            navigate(`/read/${id}`);
        }
    };

    const handleDownload = () => {
        if (book && book.pdfUrl) {
            const link = document.createElement('a');
            link.href = book.pdfUrl;
            link.download = `${book.title}.pdf`;  // Define o nome do arquivo para download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
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
                <button onClick={handleReadNow} className="view-button">Ler agora</button>
                <button onClick={handleDownload} className="view-button">Fazer download do livro</button>
            </div>
            <p className="book-note">
                <strong>OBS:</strong> <strong>Alguns livros são escaneados, o que pode causar lentidão no carregamento das páginas ao ler online. Para uma melhor experiência, faça o download.</strong>
            </p>
        </div>
    );
};

export default BookDetails;
