import React from 'react'
import '../app/globals.css'


export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__overlay"></div>
      <div className="hero__content">
        <h1 className="hero__title">
          We buy houses for cash
        </h1>
        
        <p className="hero__description">
          We buy houses and then renovate, remodel or rebuild them. 
          We offer fair value and fast closings.
        </p>
        
        <p className="hero__cta-text">
          Have a house to sell? Reach out to us.
        </p>
        
        <button className="hero__button">Sell</button>
      </div>
    </section>
  );
}