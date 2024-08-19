import React, { useEffect, useState, useMemo, useCallback, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import bookApi from './bookApi';
import MV from './components/MV';
import Header from './components/Header';
import './App.css';
import { Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

// Lazy loading para os componentes
const BookDetails = lazy(() => import('./components/BookDetails'));
const Fm = lazy(() => import('./components/fm'));
const Login = lazy(() => import('./components/Login'));

const App = () => {
    const [bookList, setBookList] = useState([]); 
    const [featureData, setFeatureData] = useState([]);
    const [blackHeader, setBlackHeader] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para controlar a autenticação
    const navigate = useNavigate();

    // Redireciona para a página de login se o usuário não estiver autenticado
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Carrega os dados dos livros uma vez
    useEffect(() => {
        const loadAll = async () => {
            let list = await bookApi.getHomeList();
            setBookList(list);
            
            let allBooks = list[0].items;
            let randomChosen = Math.floor(Math.random() * (allBooks.length - 1));
            let chosen = allBooks[randomChosen];
            let chosenInfo = await bookApi.getBookInfo(chosen._id);

            setFeatureData(chosenInfo);
        };
        loadAll();
    }, []);

    const memoizedBookList = useMemo(() => {
        return bookList.map((item, key) => (
            <MV key={key} title={item.title} items={item.items} />
        ));
    }, [bookList]);

    const handleScroll = useCallback(() => {
        if (window.scrollY > 15) {
            setBlackHeader(true);
        } else {
            setBlackHeader(false);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <div className="page">
                <Header black={blackHeader} />
                <Routes>
                    {/* Rota para a página de login */}
                    <Route path="/login" element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <Login setIsAuthenticated={setIsAuthenticated} />
                        </Suspense>
                    } />
                    {/* Rota para a página inicial */}
                    <Route path="/" element={
                        <Suspense fallback={<div>Loading...</div>}>
                            {featureData && <Fm item={featureData} />}
                            <section className="lists">
                                {memoizedBookList}
                            </section>
                            <footer>
                                Desenvolvido por Phillipe Linhares<br />
                                GitHub: https://github.com/phillipe77<br />
                                Direito de imagem para Netflix<br />
                            </footer>
                            {bookList.length <= 0 && (
                                <div className="loading">
                                    <img
                                        src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif"
                                        alt="loading"
                                    />
                                </div>
                            )}
                        </Suspense>
                    } />
                    {/* Rota para a página de detalhes do livro */}
                    <Route path="/book/:id" element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <BookDetails />
                        </Suspense>
                    } />
                </Routes>
            </div>
        </Worker>
    );
};

export default App;
