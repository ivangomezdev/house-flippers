import Image from "next/image";
import Link from 'next/link';
import "./PropertyCard.css";

// Iconos SVG
const ViewIcon = () => (
  <svg className="card__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 10c-2.48 0-4.5-2.02-4.5-4.5S9.52 5.5 12 5.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5zm0-7a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" />
  </svg>
);

const DashboardIcon = () => (
  <svg className="card__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
  </svg>
);

const PropertyCard = ({ property }) => {
  const details = `${property.bedrooms} RECAMARAS • ${property.bathrooms} BAÑOS • ${property.squareMeters} M2 CON • DEPARTAMENTO`;
  const imageUrl = property.imageUrls && property.imageUrls.length > 0
    ? property.imageUrls[0]
    : 'https://placehold.co/400x300/eeeeee/cccccc?text=Sin+Imagen';

  return (
    <div className="card">
      <div className="card__image-container">
        <img
          src={imageUrl}
          alt={`Imagen de ${property.location}`}
          width={400}
          height={300}
          className="card__image"
          onError={(e) => { e.target.src = 'https://placehold.co/400x300/eeeeee/cccccc?text=Error'; }}
        />
      </div>
      <div className="card__content">
        <p className="card__price">USD {property.cost.toLocaleString()}</p>
        <h3 className="card__title">{property.location.toUpperCase()}</h3>
        <p className="card__details">{details}</p>
      </div>

      <div className="card__overlay"></div>
      <div className="card__hover-content">
        <Link href={`/property/${property.id}`} className="card__button">
          <ViewIcon />
          <span className="card__button-text">Ver</span>
        </Link>
        {/* ENLACE ACTUALIZADO */}
        <Link href={`/dashboard/${property.id}`} className="card__button">
          <DashboardIcon />
          <span className="card__button-text">Actualizar</span>
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;