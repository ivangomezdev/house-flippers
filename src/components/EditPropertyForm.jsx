'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { db, appId } from '../lib/firebase.js';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { uploadImage } from '../lib/imageUpload.js';
import "./AddPropertyForm.css"; // Reutilizamos el estilo del formulario de adición
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// Función auxiliar para pre-formatear la fecha a 'YYYY-MM-DD'
const formatDateToInput = (dateString) => {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d)) return dateString; 
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return dateString;
  }
};


export default function EditPropertyForm({ propertyId }) {
  const router = useRouter();
  const [property, setProperty] = useState({
    location: '',
    cost: '',
    approximateValue: '',
    landSize: '',
    acquisitionDate: '',
    description: '',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    latitude: '',
    longitude: '',
    currency: 'USD',
    constructionYear: '',
  });
  const [initialImageUrls, setInitialImageUrls] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tax, setTax] = useState(0);

  // --- Efecto para cargar los datos de la propiedad ---
  useEffect(() => {
    const fetchProperty = async () => {
        if (!propertyId) return;
        const propertyDocRef = doc(db, `/artifacts/${appId}/public/data/properties/${propertyId}`);
        const docSnap = await getDoc(propertyDocRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // Convertimos la fecha de Timestamp a string ISO para el input de fecha
            const dateValue = data.acquisitionDate && data.acquisitionDate.toDate 
                                ? data.acquisitionDate.toDate().toISOString().split('T')[0] 
                                : data.acquisitionDate;
            
            setProperty({
                location: data.location || '',
                cost: data.cost || '',
                approximateValue: data.approximateValue || '',
                landSize: data.landSize || '',
                acquisitionDate: formatDateToInput(dateValue),
                description: data.description || '',
                bedrooms: data.bedrooms || '',
                bathrooms: data.bathrooms || '',
                squareFeet: data.squareFeet || '',
                latitude: data.latitude || '',
                longitude: data.longitude || '',
                currency: data.currency || 'USD',
                constructionYear: data.constructionYear || '',
            });
            setInitialImageUrls(data.imageUrls || []);
            setTax(data.tax || 0);
        } else {
             Swal.fire('Error', 'Propiedad no encontrada.', 'error');
             // Si no se encuentra, redirigir al inicio después de un error
             // router.push('/');
        }
        setIsLoading(false);
    };

    fetchProperty();
  }, [propertyId, router]);

  // --- Efecto para calcular el impuesto de crypto ---
  useEffect(() => {
    if (property.currency === 'CRYPTO' && property.cost > 0) {
      const calculatedTax = Math.floor(Number(property.cost) / 1000) * 40;
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
      setNewImages((prev) => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setNewImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };
  
  const handleRemoveExistingImage = (urlToRemove) => {
    setInitialImageUrls((prev) => prev.filter((url) => url !== urlToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      // 1. Subir nuevas imágenes
      const uploadPromises = newImages.map(uploadImage);
      const newImageUrls = await Promise.all(uploadPromises);
      
      // 2. Combinar URLs existentes (no eliminadas) con las nuevas
      const finalImageUrls = [...initialImageUrls, ...newImageUrls];
      
      if (finalImageUrls.length === 0) {
        Swal.fire('Advertencia', 'Debes tener al menos una imagen en la propiedad.', 'warning');
        setIsLoading(false);
        return;
      }


      const docData = {
        ...property,
        cost: Number(property.cost),
        approximateValue: Number(property.approximateValue),
        landSize: Number(property.landSize),
        bedrooms: Number(property.bedrooms),
        bathrooms: Number(property.bathrooms),
        squareFeet: Number(property.squareFeet),
        latitude: Number(property.latitude),
        longitude: Number(property.longitude),
        constructionYear: Number(property.constructionYear),
        imageUrls: finalImageUrls, 
        updatedAt: new Date(), 
        tax: tax,
      };

      const propertyDocRef = doc(db, `/artifacts/${appId}/public/data/properties/${propertyId}`);
      await updateDoc(propertyDocRef, docData);

      setIsLoading(false);
      await Swal.fire({
        title: '¡Éxito!',
        html: '<p>Propiedad actualizada con éxito.</p>',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });

      router.push(`/property/${propertyId}`);
      
    } catch (error) {
      setIsLoading(false);
      console.error("Error al actualizar la propiedad: ", error);
      Swal.fire('Error', 'Hubo un problema al guardar los cambios.', 'error');
    }
  };
  
  if (isLoading) {
    return <div className="form-container" style={{textAlign:"center"}}>Cargando datos de la propiedad...</div>;
  }

  return (
    <div className="form-container">
      <h1>Editar Propiedad</h1>
      <p className="expense-form-container__subtitle" style={{textAlign: 'center', marginBottom: '2rem'}}>
        ID de Propiedad: <strong>{propertyId}</strong>
      </p>
      <form onSubmit={handleSubmit} className="property-form">
        
        {/* --- SECCIÓN DE IMÁGENES EXISTENTES --- */}
        <div className="form-group">
            <label>Imágenes Existentes</label>
            <div className="file-preview">
                {initialImageUrls.length > 0 ? (
                    <ul style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                        {initialImageUrls.map((url, index) => (
                            <li key={`initial-${index}`} className="file-item" style={{display: 'block', padding: '5px', width: '150px', height: 'auto', textAlign: 'center'}}>
                                <img src={url} alt={`Existente ${index}`} style={{width: '100%', height: 'auto', borderRadius: '4px'}}/>
                                <button
                                    type="button"
                                    className="remove-button"
                                    onClick={() => handleRemoveExistingImage(url)}
                                    disabled={isLoading}
                                    style={{marginTop: '5px'}}
                                >
                                    Eliminar
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay imágenes subidas para esta propiedad.</p>
                )}
            </div>
        </div>

        {/* --- SECCIÓN PARA SUBIR NUEVAS IMÁGENES --- */}
        <div className="form-group">
          <label htmlFor="images">Subir Nuevas Imágenes</label>
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
              <span>Añadir más fotos</span>
              <p className="formats-text">JPEG, PNG</p>
              <button type="button" className="browse-button">Buscar ▶</button>
              </div>
            </label>
          </div>
          <div className="file-preview">
            {newImages.length > 0 && (
              <ul>
                {newImages.map((file, index) => (
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
        
        {/* --- CAMPOS DEL FORMULARIO --- */}

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
        
        <div className="form-group">
          <label htmlFor="approximateValue">Valor Aproximado de la Propiedad</label>
          <input type="number" id="approximateValue" name="approximateValue" value={property.approximateValue} onChange={handleChange} required disabled={isLoading} />
        </div>

        {property.currency === 'CRYPTO' && (
            <div className="form-group crypto-tax-info">
                <label>Impuesto Crypto</label>
                <p>${tax.toLocaleString()}</p>
                <span>(Se calculan $40 de impuestos por cada $1,000 de costo)</span>
            </div>
        )}
        
        <div className="form-group">
          <label htmlFor="landSize">Tamaño del Terreno (pies cuadrados)</label>
          <input type="number" id="landSize" name="landSize" value={property.landSize} onChange={handleChange} required disabled={isLoading} />
        </div>

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
          <label htmlFor="squareFeet">Cantidad de Pies Cuadrados Construidos</label>
          <input type="number" id="squareFeet" name="squareFeet" value={property.squareFeet} onChange={handleChange} required disabled={isLoading} />
        </div>

        <div className="form-group">
          <label htmlFor="constructionYear">Año de Construcción</label>
          <input type="number" id="constructionYear" name="constructionYear" value={property.constructionYear} onChange={handleChange} required disabled={isLoading} />
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
          {isLoading ? 'Guardando...' : 'Actualizar Propiedad'}
        </button>
      </form>
    </div>
  );
}