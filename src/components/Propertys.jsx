import PropertyCard from "./PropertyCard";
import "./Propertys.css";

const Properties = () => {
  // Datos hardcodeados de las propiedades
  const properties = [
    {
      id: 1,
      image: "/placeholder-1.jpg", // Asegúrate de tener estas imágenes en tu carpeta /public
      price: "12,900,000",
      title: "SLS HARBOUR BEACH, PUERTO CANCUN",
      details: "5 RECAMARAS • 6 BAÑOS • 1,200 M2 CON • DEPARTAMENTO • MLS® # 1583",
      isNew: false,
    },
    {
      id: 2,
      image: "/placeholder-2.jpg", // Asegúrate de tener estas imágenes en tu carpeta /public
      price: "4,200,000",
      title: "SLS HARBOUR BEACH, PUERTO CANCUN",
      details: "4 RECAMARAS • 5 BAÑOS • 600 M2 CON • DEPARTAMENTO • MLS® # 1662",
      isNew: true,
    },
    {
      id: 3,
      image: "/placeholder-3.jpg", // Asegúrate de tener estas imágenes en tu carpeta /public
      price: "3,200,000",
      title: "LA VELA, PUERTO CANCUN",
      details: "4 RECAMARAS • 4 BAÑOS • 800 M2 CON • DEPARTAMENTO • MLS® # 1668",
      isNew: true,
    },
  ];

  return (
    <section className="properties">
      <div className="properties__container">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
};

export default Properties;