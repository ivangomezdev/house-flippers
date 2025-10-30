// src/components/AddPropertyForm.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { db, auth, appId, initializeAuth } from '../lib/firebase.js';
import { collection, addDoc } from 'firebase/firestore';
import { uploadImage } from '../lib/imageUpload.js';
import "./AddPropertyForm.css";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function AddPropertyForm() {
  const router = useRouter();
  const [property, setProperty] = useState({
    location: '',
    cost: '',
    acquisitionDate: '',
    description: '',
    bedrooms: '',
    bathrooms: '',
    squareMeters: '',
    latitude: '',
    longitude: '',
    currency: 'USD', // <-- Valor inicial para la moneda
  });
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [tax, setTax] = useState(0); // <-- Nuevo estado para el impuesto

  useEffect(() => {
    initializeAuth()
      .then(setCurrentUser)
      .catch(error => console.error("Auth failed:", error));
  }, []);

  // --- useEffect para calcular el impuesto de crypto ---
  useEffect(() => {
    if (property.currency === 'CRYPTO' && property.cost > 0) {
      const calculatedTax = Math.floor(property.cost / 1000) * 40;
      setTax(calculatedTax);
    } else {
      setTax(0);
    }
  }, [property.cost, property.currency]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages((prev) => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      Swal.fire('Error', 'Debes estar autenticado para agregar una propiedad.', 'error');
      return;
    }
    
    if (images.length === 0) {
      Swal.fire('Error', 'Debes subir al menos una imagen.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const uploadPromises = images.map(uploadImage);
      const imageUrls = await Promise.all(uploadPromises);

      const docData = {
        ...property,
        cost: Number(property.cost),
        bedrooms: Number(property.bedrooms),
        bathrooms: Number(property.bathrooms),
        squareMeters: Number(property.squareMeters),
        latitude: Number(property.latitude),
        longitude: Number(property.longitude),
        imageUrls: imageUrls,
        createdAt: new Date(),
        userId: currentUser.uid,
        tax: tax, // <-- Guardamos el impuesto
      };

      const collectionPath = `/artifacts/${appId}/public/data/properties`;
      const docRef = await addDoc(collection(db, collectionPath), docData);

      setIsLoading(false);
      await Swal.fire({
        title: '¡Éxito!',
        html: '<i class="fas fa-home fa-3x" style="color: #4CAF50;"></i><p>Propiedad agregada con éxito</p>',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });

      router.push(`/dashboard/${docRef.id}`);

    } catch (error) {
      setIsLoading(false);
      console.error("Error al agregar la propiedad: ", error);
      Swal.fire('Error', 'Hubo un problema al subir las imágenes o guardar la propiedad.', 'error');
    }
  };

  return (
    <div className="form-container">
      <h1>Agregar Nueva Propiedad</h1>
      <form onSubmit={handleSubmit} className="property-form">
        <div className="form-group">
          <label htmlFor="images">Imágenes de la Propiedad</label>
          <div className="file-input-wrapper">
            <input
              type="file"
              id="images"
              name="images"
              multiple
              onChange={handleImageChange}
              className="file-input"
              accept="image/jpeg,image/png"
              disabled={isLoading}
            />
            <label htmlFor="images" className="file-input-label">
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"7px"}}>
              <CloudUploadIcon style={{color:"#001b4cff",fontSize:"50px"}}/>
              <span>Subir fotos de la propiedad</span>
              <p className="formats-text">JPEG, PNG</p>
              <button type="button" className="browse-button">Buscar ▶</button>
              </div>
            </label>
          </div>
          <div className="file-preview">
            {images.length > 0 && (
              <ul>
                {images.map((file, index) => (
                  <li key={index} className="file-item">
                    <span>{file.name}</span>
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => handleRemoveImage(index)}
                      disabled={isLoading}
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="location">Ubicación</label>
          <input type="text" id="location" name="location" value={property.location} onChange={handleChange} required disabled={isLoading} />
        </div>
        
        <div className="form-row">
            <div className="form-group">
                <label htmlFor="cost">Costo de la Propiedad</label>
                <input type="number" id="cost" name="cost" value={property.cost} onChange={handleChange} required disabled={isLoading} />
            </div>
            <div className="form-group">
                <label htmlFor="currency">Moneda</label>
                <select id="currency" name="currency" value={property.currency} onChange={handleChange} disabled={isLoading} required>
                    <option value="USD">USD</option>
                    <option value="MXN">MXN</option>
                    <option value="CRYPTO">CRYPTO</option>
                </select>
            </div>
        </div>
        
        {property.currency === 'CRYPTO' && (
            <div className="form-group crypto-tax-info">
                <label>Impuesto Crypto</label>
                <p>${tax.toLocaleString()}</p>
                <span>(Se calculan $40 de impuestos por cada $1,000 de costo)</span>
            </div>
        )}

        <div className="form-group">
          <label htmlFor="acquisitionDate">Fecha de Adquisición</label>
          <input type="date" id="acquisitionDate" name="acquisitionDate" value={property.acquisitionDate} onChange={handleChange} required disabled={isLoading} />
        </div>
        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea id="description" name="description" value={property.description} onChange={handleChange} rows="4" required disabled={isLoading}></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="bedrooms">Cantidad de Recámaras</label>
          <input type="number" id="bedrooms" name="bedrooms" value={property.bedrooms} onChange={handleChange} required disabled={isLoading} />
        </div>
        <div className="form-group">
          <label htmlFor="bathrooms">Cantidad de Baños</label>
          <input type="number" id="bathrooms" name="bathrooms" value={property.bathrooms} onChange={handleChange} required disabled={isLoading} />
        </div>
        <div className="form-group">
          <label htmlFor="squareMeters">Cantidad de Metros Cuadrados</label>
          <input type="number" id="squareMeters" name="squareMeters" value={property.squareMeters} onChange={handleChange} required disabled={isLoading} />
        </div>

        <div className="form-group">
          <label htmlFor="latitude">Latitud</label>
          <input type="number" step="any" id="latitude" name="latitude" value={property.latitude} onChange={handleChange} placeholder="Ej: 20.6295" required disabled={isLoading} />
        </div>
        <div className="form-group">
          <label htmlFor="longitude">Longitud</label>
          <input type="number" step="any" id="longitude" name="longitude" value={property.longitude} onChange={handleChange} placeholder="Ej: -87.0738" required disabled={isLoading} />
        </div>
        
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Agregar Propiedad'}
        </button>
      </form>
    </div>
  );
}