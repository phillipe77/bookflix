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
                    <div className="title">Biblioteca Cristã Digital</div>
                    <div className="info">
                    </div>
                    <div className='description'>
                        Bem-vindo à minha coleção pessoal de livros, Compartilhando para juntos nos edificarmos!
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
