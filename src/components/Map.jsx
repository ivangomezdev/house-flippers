// src/components/Map.jsx
'use client';

// Asegúrate de importar 'leaflet/dist/leaflet.css' ANTES de los componentes
import 'leaflet/dist/leaflet.css'; 
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './Map.css';

// Arreglo para el icono por defecto de Leaflet que a veces no carga en Webpack
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const Map = ({ lat, lng, locationName }) => {
  if (typeof window === 'undefined') {
    return null; // No renderizar nada en el servidor
  }

  const position = [lat, lng];

  return (
    <div className="map-container">
      <h2 className="map-title">Ubicación en el Mapa</h2>
      {/* El componente MapContainer necesita tener una altura definida para ser visible */}
      <MapContainer 
        center={position} 
        zoom={15} 
        scrollWheelZoom={false} 
        style={{ height: '400px', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            {locationName || 'Ubicación de la propiedad'}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;