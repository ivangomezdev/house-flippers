import Image from "next/image";
import Link from 'next/link'; // Importa Link
import "./PropertyCard.css";

const PropertyCard = ({ property }) => {
  // Construye los detalles a partir de los datos de Firebase
  const details = `${property.bedrooms} RECAMARAS • ${property.bathrooms} BAÑOS • ${property.squareMeters} M2 CON • DEPARTAMENTO`;
  
  // Usa la primera imagen del array, o un placeholder
  const imageUrl = property.imageUrls && property.imageUrls.length > 0 
    ? property.imageUrls[0] 
    : 'https://placehold.co/400x300/eeeeee/cccccc?text=Sin+Imagen';

  return (
    <Link href={`/property/${property.id}`} className="card-link">
      <div className="card">
        <div className="card__image-container">
          <Image
            src={imageUrl}
            alt={`Imagen de ${property.location}`}
            width={400}
            height={300}
            className="card__image"
            // Agrega un fallback por si la URL de Firebase falla
            onError={(e) => { e.target.src = 'https://placehold.co/400x300/eeeeee/cccccc?text=Error'; }}
          />
          {/* Opcional: puedes agregar una lógica para "NUEVO" basada en property.createdAt */}
        </div>
        <div className="card__content">
          <p className="card__price">USD {property.cost.toLocaleString()}</p>
          <h3 className="card__title">{property.location.toUpperCase()}</h3>
          <p className="card__details">{details}</p>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
