// src/components/PropertyDetailClient.jsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic'; // <-- IMPORTANTE: Importa 'dynamic'
import Navbar from './NavBar';
import PropertyExpenses from './PropertyExpenses';
import ImageSlider from './ImageSlider';
import '../app/property/[id]/PropertyDetail.css';
import FmdGoodIcon from '@mui/icons-material/FmdGood';

const Map = dynamic(() => import('./Map'), { 
  ssr: false, // <-- La clave para que funcione
  loading: () => <p style={{textAlign: 'center', padding: '2rem'}}>Cargando mapa...</p>
});


export default function PropertyDetailClient({ property, expenses, refactionImages }) {
  
  const getInitialImage = () => {
    if (refactionImages && refactionImages.length > 0) {
      return refactionImages[0].newImageUrl;
    }
    if (property.imageUrls && property.imageUrls.length > 0) {
      return property.imageUrls[0];
    }
    return '';
  };

  const [mainImage, setMainImage] = useState(getInitialImage());

  const getRefactionData = (imageUrl) => {
    return refactionImages.find(ri => ri.newImageUrl === imageUrl);
  };

  const handleThumbnailClick = (imageUrl) => {
    setMainImage(imageUrl);
  };
  
  const refactionOriginalUrls = refactionImages.map(r => r.originalImageUrl);
  const standaloneImages = (property.imageUrls || []).filter(url => !refactionOriginalUrls.includes(url));
  const verticalImages = standaloneImages.slice(0, 4);
  const horizontalImages = standaloneImages.slice(4);
  const currentRefaction = getRefactionData(mainImage);

  return (
    <>
      <Navbar />
      <div className="property-detail-container">
        <h1 className="property-title"> <FmdGoodIcon/> {property.location}</h1>
        
        <div className="property-card-detail">
          <div className="gallery-layout">
            {verticalImages.length > 0 && (
              <div className="thumbnail-column">
                {verticalImages.map((url, index) => (
                  <img
                    key={`v-${index}`}
                    src={url}
                    alt={`Miniatura ${index + 1}`}
                    className={`thumbnail-image ${mainImage === url ? 'active' : ''}`}
                    onClick={() => handleThumbnailClick(url)}
                  />
                ))}
                <img style={{width:"100px"}} src="https://i.imgur.com/G8zpABo.jpeg" alt="" />
              </div>
            )}
            
            <div className="main-gallery-area">
              <div className="main-image-container">
                {currentRefaction ? (
                  <ImageSlider 
                    beforeImage={currentRefaction.originalImageUrl}
                    afterImage={currentRefaction.newImageUrl}
                  />
                ) : (
                  <img
                    key={mainImage}
                    src={mainImage || 'https://placehold.co/600x400/eeeeee/cccccc?text=Sin+Imagen'}
                    alt={property.location}
                    className="main-property-image"
                  />
                )}
              </div>
              
              {(horizontalImages.length > 0 || refactionImages.length > 0) && (
                <div className="thumbnail-row">
                   {horizontalImages.map((url, index) => (
                    <img
                      key={`h-${index}`}
                      src={url}
                      alt={`Miniatura ${index + 5}`}
                      className={`thumbnail-image ${mainImage === url ? 'active' : ''}`}
                      onClick={() => handleThumbnailClick(url)}
                    />
                  ))}
                  {refactionImages.map((refImg) => (
                    <img
                      key={`ref-${refImg.id}`}
                      src={refImg.newImageUrl}
                      alt={`Refacción ${refImg.description || ''}`}
                      className={`thumbnail-image ${mainImage === refImg.newImageUrl ? 'active' : ''}`}
                      onClick={() => handleThumbnailClick(refImg.newImageUrl)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="property-info">
            <h2>{property.description.substring(0, 100)}</h2>
            {currentRefaction && (
                <p className="refaction-description-text">
                    <strong>Refacción:</strong> {currentRefaction.description || 'Sin descripción'}
                </p>
            )}
            <p className="price">USD ${property.cost.toLocaleString()}</p>
            <p className="description">{property.description}</p>
            <div className="specs">
              <span>🛏️ {property.bedrooms} Recámaras</span>
              <span>🛁 {property.bathrooms} Baños</span>
              <span>📏 {property.squareMeters} m²</span>
            </div>
          </div>
        </div>
        
        {/* El mapa se renderizará aquí cuando el cliente lo cargue */}
        {property.latitude && property.longitude && (
          <Map 
            lat={property.latitude} 
            lng={property.longitude} 
            locationName={property.location} 
          />
        )}
        
        <PropertyExpenses expenses={expenses} />
      </div>
    </>
  );
}