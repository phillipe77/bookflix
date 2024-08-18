import React, { useEffect, useState } from 'react';
import bookApi from './bookApi';
import MV from './components/MV';
import Header from './components/Header';
import BookDetails from './components/BookDetails';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const App = () => {
    const [bookList, setBookList] = useState([]); 
    const [featureData, setFeatureData] = useState(null);
    const [blackHeader, setBlackHeader] = useState(false);

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

    useEffect(() => {
        const scrollListener = () => {
            if (window.scrollY > 15) {
                setBlackHeader(true);
            } else {
                setBlackHeader(false);
            }
        };
        window.addEventListener('scroll', scrollListener);
        return () => {
            window.removeEventListener('scroll', scrollListener);
        };
    }, []);

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Router>
                <div className="page">
                    <Header black={blackHeader} />
                    <Routes>
                        <Route path="/" element={
                            <>
                                {featureData && <Fm item={featureData} />}
                                <section className="lists">
                                    {bookList.map((item, key) => (
                                        <MV key={key} title={item.title} items={item.items} />
                                    ))}
                                </section>
                                <footer>
                                    Desenvolvido por Phillipe Linhares<br />
                                    GitHub: https://github.com/phillipe77<br />
                                    Direito de imagem para Netflix<br />
                                    Dados dos livros retirados da API Local
                                </footer>
                                {bookList.length <= 0 && (
                                    <div className="loading">
                                        <img
                                            src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif"
                                            alt="loading"
                                        />
                                    </div>
                                )}
                            </>
                        } />
                        <Route path="/book/:id" element={<BookDetails />} />
                    </Routes>
                </div>
            </Router>
        </Worker>
    );
};

export default App;
