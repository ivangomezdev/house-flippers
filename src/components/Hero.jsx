import React from 'react';
import './Hero.css';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__overlay"></div>
      <div className="hero__content">
       <img style={{width:"500px",background:"rgba(200, 200, 200, 0.2)",borderRadius:"5px",padding:"8px"}} src="https://i.imgur.com/Ql5bBMO.png" alt="logoTitle" />
       
        
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