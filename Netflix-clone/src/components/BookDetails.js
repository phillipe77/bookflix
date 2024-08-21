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
    const [logoSrc, setLogoSrc] = useState('/logo192.png'); // Estado para a logo

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

    useEffect(() => {
        // Detecta o tamanho da tela e ajusta a logo
        const updateLogo = () => {
            if (window.innerWidth <= 768) {
                setLogoSrc('/logo512.png'); // Usa logo512.png para dispositivos móveis
            } else {
                setLogoSrc('/logo192.png'); // Usa logo192.png para dispositivos desktop
            }
        };

        updateLogo(); // Atualiza logo ao montar o componente
        window.addEventListener('resize', updateLogo); // Atualiza logo ao redimensionar a tela

        return () => window.removeEventListener('resize', updateLogo); // Limpa o evento ao desmontar
    }, []);

    const handleReadNow = () => {
        if (book && book.pdfUrl) {
            navigate(`/read/${id}`);
        }
    };

    const handleDownload = async () => {
        if (book && book.pdfUrl) {
            try {
                const response = await fetch(book.pdfUrl);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${book.title}.pdf`;
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            } catch (err) {
                console.error('Falha ao baixar o PDF', err);
            }
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
            <div className="logo-container" onClick={() => navigate('/')}>
                <img src={logoSrc} alt="Logos" className="logo-icon" />
            </div>
            <div className="book-info">
                <img src={book.coverUrl} alt={book.title} className="book-cover" />
                <h1>{book.title}</h1>
                <p><strong>Autor:</strong> {book.author}</p>
                <p><strong>Descrição:</strong> {book.description}</p>
                <p><strong>Categoria:</strong> {book.category}</p>
            </div>
            <div className="view-buttons">
                <button onClick={handleReadNow} className="view-button">LER AGORA</button>
                <button onClick={handleDownload} className="view-button">FAZER DOWNLOAD</button>
            </div>
            <p className="book-note">
                <strong>OBS:</strong> SE VOCÊ NOTAR QUE O LIVRO ESTÁ DEMORANDO PARA CARREGAR, PODE SER PORQUE O LIVRO SEJA DO TIPO QUE FOI ESCANEADO E ISSO CAUSA LENTIDÃO. PARA UMA LEITURA MAIS TRANQUILA, EXPERIMENTE FAZER O DOWNLOAD.
            </p>
        </div>
    );
};

export default BookDetails;
