'use client'; // <-- Convertido a Componente de Cliente para usar hooks

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import './PropertyDetail.css';
import { db, appId } from '../../../lib/firebase'; // Importa db y appId
import { doc, getDoc } from 'firebase/firestore';

export default function PropertyDetailPage() {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams(); // Hook para obtener el 'id' desde la URL

  useEffect(() => {
    const fetchProperty = async () => {
      if (!params.id) return; // Si no hay id, no hagas nada

      setLoading(true);
      try {
        // Construye la ruta al documento
        const docPath = `/artifacts/${appId}/public/data/properties/${params.id}`;
        const docRef = doc(db, docPath);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProperty({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such document!");
          setProperty(null); // Propiedad no encontrada
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [params.id]); // Vuelve a ejecutar si el id cambia

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

  // Obtiene la primera imagen como principal, o un placeholder
  const mainImage = property.imageUrls && property.imageUrls.length > 0 
    ? property.imageUrls[0] 
    : 'https://placehold.co/600x400/eeeeee/cccccc?text=Sin+Imagen';

  return (
    <>
      <Navbar />
      <div className="property-detail-container">
        <h1 className="property-title">{property.location}</h1>
        <div className="property-card-detail">
          <img src={mainImage} alt={property.location} className="property-image" />
          <div className="property-info">
            <h2>{property.description.substring(0, 100)}...</h2>
            <p className="price">USD ${property.cost.toLocaleString()}</p>
            <p className="description">{property.description}</p>
            <div className="specs">
              <span>🛏️ {property.bedrooms} Recámaras</span>
              <span>🛁 {property.bathrooms} Baños</span>
              <span>📏 {property.squareMeters} m²</span>
            </div>
            {/* Aquí podrías agregar una galería con el resto de property.imageUrls */}
          </div>
        </div>
      </div>
    </>
  );
}
