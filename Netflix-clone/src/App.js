import React, { useEffect, useState } from 'react';
import bookApi from './bookApi';
import MV from './components/MV';
import Fm from './components/fm';
import Header from './components/Header';
import BookDetails from './components/BookDetails';  // Novo componente para detalhes do livro
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
    const [bookList, setBookList] = useState([]); 
    const [featureData, setFeatureData] = useState([]);
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
        <Router>
            <div className="page">
                <Header black={blackHeader} />
                <Routes>
                    {/* Rota para a página inicial */}
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
                    
                    {/* Rota para a página de detalhes do livro */}
                    <Route path="/book/:id" element={<BookDetails />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
