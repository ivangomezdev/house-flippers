// src/components/ImageSlider.jsx
'use client'; // <-- Muy importante para que solo se ejecute en el cliente

import { useEffect } from 'react';
import { ImgComparisonSlider } from 'img-comparison-slider';

const ImageSlider = ({ beforeImage, afterImage }) => {

  // --- CORRECCIÓN ---
  // El hook useEffect debe estar DENTRO del cuerpo del componente.
  useEffect(() => {
    // Como es un Web Component, necesitamos registrarlo una vez en el cliente.
    if (!customElements.get('img-comparison-slider')) {
      customElements.define('img-comparison-slider', ImgComparisonSlider);
    }
  }, []); // El array vacío asegura que esto solo se ejecute una vez.

  return (
    // El JSX debe usar el nombre del custom element registrado.
    <img-comparison-slider class="img-comparison-slider-custom">
      <img slot="before" src={beforeImage} alt="Antes de la refacción" />
      <img slot="after" src={afterImage} alt="Después de la refacción" />
    </img-comparison-slider>
  );
};

export default ImageSlider;