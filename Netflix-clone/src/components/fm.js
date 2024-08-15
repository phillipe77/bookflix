import React from 'react';
import './fm.css';
import bannerImage from './banner.jpg';

const Fm = ({ item }) => {
    return (
        <section className="fm" style={{
            backgroundSize: 'cover',
            backgroundPosition: 'top',
            backgroundImage: `url(${bannerImage})`
        }}>
            <div className="vertical--fade">
                <div className="horizontal--fade">
                    <div className="title">BookFlix: Sua Biblioteca Cristã Digital</div>
                    <div className="info">
                        <div className="seasons">Milhares de livros cristãos</div>
                        <div className='ano'>Conteúdo Sempre Atualizado</div>
                    </div>
                    <div className='description'>
                        Encontre uma grande coleção de livros cristãos que vão te inspirar, edificar você, sua família, seu ministério e sua igreja. No BookFlix, você tem acesso a obras clássicas e contemporâneas que abordam temas teológicos, estudos bíblicos, discipulados, batalhas espirituais, devocionais e muito outros.
                    </div>
                    <div className='buttons'>
                        <button onClick={() => window.location.href = 'explorar'} className="playBtn">► Explorar</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Fm;
