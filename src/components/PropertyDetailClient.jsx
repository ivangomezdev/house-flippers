// src/components/PropertyDetailClient.jsx
'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Navbar from './NavBar'
import PropertyExpenses from './PropertyExpenses'
import ImageSlider from './ImageSlider'
import '../app/property/[id]/PropertyDetail.css'
import FmdGoodIcon from '@mui/icons-material/FmdGood'

// --- CARGA DINÁMICA DEL MAPA ---
const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando mapa...</p>
  )
})

export default function PropertyDetailClient ({
  property,
  expenses,
  refactionImages
}) {
  const getInitialImage = () => {
    if (refactionImages && refactionImages.length > 0) {
      return refactionImages[0].newImageUrl
    }
    if (property.imageUrls && property.imageUrls.length > 0) {
      return property.imageUrls[0]
    }
    return 'https://placehold.co/600x400/eeeeee/cccccc?text=Sin+Imagen'
  }

  const [mainImage, setMainImage] = useState(getInitialImage())

  const getRefactionData = imageUrl => {
    return refactionImages.find(ri => ri.newImageUrl === imageUrl)
  }

  const handleThumbnailClick = imageUrl => {
    setMainImage(imageUrl)
  }

  // Lógica para dividir las imágenes
  const refactionOriginalUrls = refactionImages.map(r => r.originalImageUrl)
  const standaloneImages = (property.imageUrls || []).filter(
    url => !refactionOriginalUrls.includes(url)
  )

  // Dividimos las imágenes: las primeras 4 a la columna vertical, el resto a la horizontal.
  const verticalImages = standaloneImages.slice(0, 4)
  const horizontalImages = standaloneImages.slice(4)

  const currentRefaction = getRefactionData(mainImage)

  return (
    <>
      <Navbar />
      <div className='property-detail-container'>
        <h1 className='property-title'>
          <span style={{ display: 'flex', alignItems: 'center' }}>
            {' '}
            <FmdGoodIcon /> {property.location}
          </span>
          <img
            style={{ width: '100px' }}
            src='https://i.imgur.com/Ql5bBMO.png'
            alt=''
          />
        </h1>

        <div className='property-card-detail'>
          <div className='gallery-layout'>
            {/* --- COLUMNA DE MINIATURAS (IZQUIERDA) --- */}
            {verticalImages.length > 0 && (
              <div className='thumbnail-column'>
                {verticalImages.map((url, index) => (
                  <Image
                    key={`v-${index}`}
                    src={url}
                    alt={`Miniatura ${index + 1}`}
                    width={90} // Tamaño específico para columna
                    height={70} // Tamaño específico para columna
                    style={{ objectFit: 'cover' }}
                    className={`thumbnail-image ${
                      mainImage === url ? 'active' : ''
                    }`}
                    onClick={() => handleThumbnailClick(url)}
                  />
                ))}
              </div>
            )}

            {/* --- ÁREA PRINCIPAL DE LA GALERÍA (CENTRO) --- */}
            <div className='main-gallery-area'>
              <div className='main-image-container'>
                {currentRefaction ? (
                  <ImageSlider
                    beforeImage={currentRefaction.originalImageUrl}
                    afterImage={currentRefaction.newImageUrl}
                  />
                ) : (
                  <Image
                    key={mainImage}
                    src={mainImage}
                    alt={property.location}
                    fill
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    style={{ objectFit: 'contain' }}
                    priority
                    className='main-property-image'
                  />
                )}
              </div>

              {/* --- FILA DE MINIATURAS (ABAJO) --- */}
              {(horizontalImages.length > 0 || refactionImages.length > 0) && (
                <div className='thumbnail-row'>
                  {horizontalImages.map((url, index) => (
                    <Image
                      key={`h-${index}`}
                      src={url}
                      alt={`Miniatura ${index + 5}`}
                      width={100} // Tamaño específico para fila
                      height={80} // Tamaño específico para fila
                      style={{ objectFit: 'cover' }}
                      className={`thumbnail-image ${
                        mainImage === url ? 'active' : ''
                      }`}
                      onClick={() => handleThumbnailClick(url)}
                    />
                  ))}
                  {refactionImages.map(refImg => (
                    <Image
                      key={`ref-${refImg.id}`}
                      src={refImg.newImageUrl}
                      alt={`Refacción ${refImg.description || ''}`}
                      width={100} // Tamaño específico para fila
                      height={80} // Tamaño específico para fila
                      style={{ objectFit: 'cover' }}
                      className={`thumbnail-image ${
                        mainImage === refImg.newImageUrl ? 'active' : ''
                      }`}
                      onClick={() => handleThumbnailClick(refImg.newImageUrl)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* --- INFORMACIÓN DE LA PROPIEDAD --- */}
          <div className='property-info'>
            <h2>{property.description.substring(0, 100)}</h2>
            {currentRefaction && (
              <p className='refaction-description-text'>
                <strong>Refacción:</strong>{' '}
                {currentRefaction.description || 'Sin descripción'}
              </p>
            )}
            <p className='price'>USD ${property.cost.toLocaleString()}</p>
            <p className='description'>{property.description}</p>
            <div className='specs'>
              <span>🛏️ {property.bedrooms} Recámaras</span>
              <span>🛁 {property.bathrooms} Baños</span>
              <span>🏠 {property.propertySize || 'N/A'} pies construidos</span>
              <span>🌳 {property.landSize || 'N/A'} pies de terreno</span>
              <span>📅 {property.constructionYear || 'N/A'} Año de construcción</span>
              <span>    

                💰 Valor aprox. ${property.approximateValue || 'No disponible'}
              </span>
            </div>
          </div>
        </div>

        {property.latitude && property.longitude && (
          <Map
            lat={property.latitude}
            lng={property.longitude}
            locationName={property.location}
          />
        )}
      </div>
    </>
  )
}