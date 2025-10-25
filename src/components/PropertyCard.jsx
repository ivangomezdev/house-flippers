import Image from "next/image";
import "./PropertyCard.css";

const PropertyCard = ({ property }) => {
  return (
    <div className="card">
      <div className="card__image-container">
        <Image
          src={property.image}
          alt={`Imagen de ${property.title}`}
          width={400}
          height={300}
          className="card__image"
        />
        {property.isNew && <span className="card__badge">NUEVO</span>}
      </div>
      <div className="card__content">
        <p className="card__price">USD {property.price}</p>
        <h3 className="card__title">{property.title}</h3>
        <p className="card__details">{property.details}</p>
      </div>
    </div>
  );
};

export default PropertyCard;