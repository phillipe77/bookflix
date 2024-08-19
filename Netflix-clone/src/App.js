import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import bookApi from './bookApi';
import MV from './components/MV';
import Header from './components/Header';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { SpeedInsights } from '@vercel/speed-insights/react';

const API_BASE = 'https://back-bookflix.vercel.app/api/books';

// Lazy loading para os componentes
const BookDetails = lazy(() => import('./components/BookDetails'));
const Fm = lazy(() => import('./components/fm'));
const Login = lazy(() => import('./components/Login'));

const App = () => {
    const [bookList, setBookList] = useState([]); 
    const [featureData, setFeatureData] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    // Carrega os dados dos livros uma vez e usa cache
    useEffect(() => {
        if (isAuthenticated) {
            const cachedList = localStorage.getItem('bookList');
            if (cachedList) {
                const parsedList = JSON.parse(cachedList);
                console.log('Cached Book List:', parsedList);
                setBookList(parsedList);
            } else {
                const loadAll = async () => {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`${API_BASE}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        console.error("Erro ao buscar livros:", response.statusText);
                        return;
                    }

                    const list = await response.json();
                    console.log('Fetched Book List:', list);
                    setBookList(list);
                    localStorage.setItem('bookList', JSON.stringify(list));

                    if (list.length > 0 && list[0].items && list[0].items.length > 0) {
                        let allBooks = list[0].items;
                        let randomChosen = Math.floor(Math.random() * (allBooks.length - 1));
                        let chosen = allBooks[randomChosen];
                        let chosenInfo = await bookApi.getBookInfo(chosen._id);
                        setFeatureData(chosenInfo);
                    }
                };
                loadAll();
            }
        }
    }, [isAuthenticated]);

    // Memoriza o valor de bookList para evitar re-renderizações desnecessárias
    const memoizedBookList = useMemo(() => {
        return bookList.map((item, key) => {
            console.log(`Rendering MV for: ${item.title}`);
            return <MV key={key} title={item.title} items={item.items} />;
        });
    }, [bookList]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Router>
                <div className="page">
                    {isAuthenticated ? (
                        <>
                            <Header onLogout={handleLogout} />
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

                                <Route path="*" element={<Navigate to="/" />} />
                            </Routes>
                        </>
                    ) : (
                        <Routes>
                            <Route path="/login" element={
                                <Suspense fallback={<div>Loading...</div>}>
                                    <Login onLogin={handleLogin} />
                                </Suspense>
                            } />
                            <Route path="*" element={<Navigate to="/login" />} />
                        </Routes>
                    )}
                    <SpeedInsights />
                </div>
            </Router>
        </Worker>
    );
};

export default App;
