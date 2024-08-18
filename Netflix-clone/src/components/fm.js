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
                    <div className="title">Logos: Biblioteca Cristã Digital</div>
                    <div className="info">
                        <div className="seasons">Livros cristãos</div>
                        <div className='ano'>Conteúdo Sempre Atualizado</div>
                    </div>
                    <div className='description'>
                        Compartilhando alguns materiais pessoais pra edificação!
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
