'use client'; // <-- Convertido a Componente de Cliente

import { useState, useEffect } from 'react';
import PropertyCard from "./PropertyCard";
import "./Propertys.css";
import { db,appId } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const collectionPath = `/artifacts/${appId}/public/data/properties`;
    
    // Escucha cambios en la colección en tiempo real
    const unsubscribe = onSnapshot(collection(db, collectionPath), (snapshot) => {
      const propsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Mi regla de oro es no usar orderBy, así que ordenamos aquí
      propsList.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

      setProperties(propsList);
      setLoading(false);
    }, (error) => {
      console.error("Error al obtener propiedades: ", error);
      setLoading(false);
    });

    // Limpia el listener al desmontar el componente
    return () => unsubscribe();
  }, []); // El array vacío asegura que esto se ejecute solo una vez

  if (loading) {
    return (
      <section className="properties">
        <div className="properties__container">
          <p>Cargando propiedades...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="properties">
      <div className="properties__container">
        {properties.length === 0 ? (
          <p>No hay propiedades para mostrar. ¡Agrega la primera!</p>
        ) : (
          properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))
        )}
      </div>
    </section>
  );
};

export default Properties;
