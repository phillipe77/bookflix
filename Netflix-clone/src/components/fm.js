import React from 'react';
import './fm.css';
import { Switch, Route, Link } from 'react-router-dom';
import bannerImage from './banner.jpg'; // Importando a imagem corretamente

export default ({ item }) => {
    return (
        <section className="fm" style={{
            backgroundSize: 'cover',
            backgroundPosition: 'top',
            backgroundImage: `url(${bannerImage})` // Usando a imagem importada
        }}>
        <div className="vertical--fade">
    <div className="horizontal--fade">
        <div className="title">BookFlix: Sua Biblioteca Cristã Digital</div>
        <div className="info">
            <div className="seasons">Milhares de livros cristãos</div>
            <div className='ano'>Conteúdo Sempre Atualizado</div>
        </div>
        <div className='description'>
            Encontre uma grande coleção de livros cristãos que vão te inspirar, edificar você, sua familia, seu ministério e sua igreja. No BookFlix, você tem acesso a obras clássicas e contemporâneas que abordam temas teológicos, estudos biblicos, discipulados, batalhas espirituais, devocionais e muito outros.
        </div>
        <div className='buttons'>
            <a href='explorar' className="playBtn">► Explorar</a>
        </div>
    </div>
</div>
        </section>
    );
}

