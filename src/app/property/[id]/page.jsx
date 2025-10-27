'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import PropertyExpenses from '../../../components/PropertyExpenses';
import ImageSlider from '../../../components/ImageSlider'; // <-- IMPORTAMOS NUESTRO WRAPPER
import './PropertyDetail.css';
import { db, appId } from '../../../lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

export default function PropertyDetailPage() {
  const [property, setProperty] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [refactionImages, setRefactionImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const params = useParams();

  useEffect(() => {
    const fetchPropertyAndRelatedData = async () => {
      if (!params.id) return;

      setLoading(true);
      try {
        const docPath = `/artifacts/${appId}/public/data/properties/${params.id}`;
        const propertyDocRef = doc(db, docPath);
        const docSnap = await getDoc(propertyDocRef);

        if (docSnap.exists()) {
          const propertyData = { id: docSnap.id, ...docSnap.data() };
          setProperty(propertyData);
          if (propertyData.imageUrls && propertyData.imageUrls.length > 0) {
            setMainImage(propertyData.imageUrls[0]);
          }

          const expensesColPath = `${docPath}/expenses`;
          const expensesSnapshot = await getDocs(collection(db, expensesColPath));
          const expensesList = expensesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          expensesList.sort((a, b) => b.date.toDate() - a.date.toDate());
          setExpenses(expensesList);

          const refactionImagesColRef = collection(db, `${docPath}/refactionImages`);
          const refactionSnapshot = await getDocs(refactionImagesColRef);
          const refactionsList = refactionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setRefactionImages(refactionsList);

        } else {
          console.log("No such document!");
          setProperty(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyAndRelatedData();
  }, [params.id]);

  const isRefactionImage = (imageUrl) => {
    return refactionImages.find(ri => ri.newImageUrl === imageUrl);
  };

  const handleThumbnailClick = (imageUrl) => {
    setMainImage(imageUrl);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="property-detail-container">
          <h1 className="loading-text">Cargando propiedad...</h1>
        </div>
      </>
    );
  }

  if (!property) {
    return (
      <>
        <Navbar />
        <div className="property-detail-container">
          <h1 className="loading-text">Propiedad no encontrada.</h1>
        </div>
      </>
    );
  }

  const imageUrls = property.imageUrls || [];
  const verticalImages = imageUrls.slice(0, 4);
  const horizontalImages = imageUrls.slice(4);
  const currentRefaction = isRefactionImage(mainImage);

  return (
    <>
      <Navbar />
      <div className="property-detail-container">
        <h1 className="property-title">{property.location}</h1>
        
        <div className="property-card-detail">
          <div className="gallery-layout">
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
            </div>
            <div className="main-gallery-area">
              <div className="main-image-container">
                {currentRefaction ? (
                  // Usamos nuestro componente wrapper
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
            </div>
          </div>
          <div className="property-info">
            <h2>{property.description.substring(0, 100)}...</h2>
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
        
        <PropertyExpenses expenses={expenses} />
      </div>
    </>
  );
}