import React from 'react';
import './Hero.css';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__overlay"></div>
      <div className="hero__content">
        <img
          className="hero__logo" // Añadimos una clase aquí
          src="https://i.imgur.com/Ql5bBMO.png"
          alt="logoTitle"
        />

        <p className="hero__cta-text"></p>
        <div className="hero__button-group">
          <Link href="/add-property" passHref>
            <button className="hero__button">Agregar propiedad +</button>
          </Link>
          <button className="hero__button">Ver más</button>
        </div>
      </div>
    </section>
  );
}