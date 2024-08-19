import React, { useEffect, useState, useMemo, useCallback, lazy, Suspense } from 'react';
import bookApi from './bookApi';
import MV from './components/MV';
import Header from './components/Header';
import Login from './components/Login'; // Importando o componente de Login
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const BookDetails = lazy(() => import('./components/BookDetails'));
const Fm = lazy(() => import('./components/fm'));

const App = () => {
    const [bookList, setBookList] = useState([]); 
    const [featureData, setFeatureData] = useState([]);
    const [blackHeader, setBlackHeader] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const navigate = useNavigate();

    // Verifica o estado de autenticação no carregamento da página
    useEffect(() => {
        const loggedIn = localStorage.getItem('isAuthenticated');
        if (loggedIn) {
            setIsAuthenticated(true);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogin = () => {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

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

    if (!isAuthenticated) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <div className="page">
                <Header black={blackHeader} onLogout={handleLogout} />
                <Routes>
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
                    <Route path="/book/:id" element={
                        <Suspense fallback={<div>Loading...</div>}>
                            <BookDetails />
                        </Suspense>
                    } />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                </Routes>
            </div>
        </Worker>
    );
};

export default App;
