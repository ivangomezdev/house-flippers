import React from 'react';
import './Hero.css';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__overlay"></div>
      <div className="hero__content">
        <h1 className="hero__title">
        EXPO APEX HOUSE FLIPPERS
        </h1>
        
        <p className="hero__description">
         Compra y remodelación de propiedades
        </p>
        
        <p className="hero__cta-text">
        
         </p>
        <div style={{display:"flex",alignItems:"center",gap:"8px"
        }}>
            <Link href="/add-property" passHref>
        <button className="hero__button">Agregar propiedad +</button>
          </Link>
         <button className="hero__button">Ver más</button>
        </div>

      </div>
    </section>
  );
}