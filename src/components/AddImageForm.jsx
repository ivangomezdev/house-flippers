'use client';
import { useState, useEffect } from 'react';
import { db, appId } from '../lib/firebase';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Swal from 'sweetalert2';
import Image from 'next/image';
import './AddImageForm.css';
import { uploadImage } from '../lib/imageUpload';
const AddImageForm = ({ propertyId }) => {
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImageUrlPreview, setNewImageUrlPreview] = useState('');
  const [description, setDescription] = useState('');
  const [propertyImageUrls, setPropertyImageUrls] = useState([]); 
  const [selectedOriginalImageUrl, setSelectedOriginalImageUrl] = useState(''); // URL de la imagen "antes"
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('newImages'); // 'newImages' o 'refactions'

  useEffect(() => {
    const fetchPropertyImages = async () => {
      if (!propertyId) return;
      const propertyDocRef = doc(db, `/artifacts/${appId}/public/data/properties/${propertyId}`);
      const docSnap = await getDoc(propertyDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setPropertyImageUrls(data.imageUrls || []);
      }
    };
    fetchPropertyImages();
  }, [propertyId]);

  const handleNewImageFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImageFile(file);
      setNewImageUrlPreview(URL.createObjectURL(file));
    }
  };

  const handleAddRegularImage = async (e) => {
    e.preventDefault();
    if (!newImageFile) {
      Swal.fire('Error', 'Por favor, selecciona una imagen para subir.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const uploadedUrl = await uploadImage(newImageFile);
      const propertyDocRef = doc(db, `/artifacts/${appId}/public/data/properties/${propertyId}`);
      await updateDoc(propertyDocRef, {
        imageUrls: [...propertyImageUrls, uploadedUrl],
      });

      Swal.fire('¡Éxito!', 'Imagen agregada correctamente a la propiedad.', 'success');
      setNewImageFile(null);
      setNewImageUrlPreview('');
      // Actualizar la lista de imágenes de la propiedad
      setPropertyImageUrls((prev) => [...prev, uploadedUrl]);

    } catch (error) {
      console.error('Error al agregar imagen regular:', error);
      Swal.fire('Error', 'Hubo un problema al subir la imagen.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRefactionImage = async (e) => {
    e.preventDefault();
    if (!newImageFile || !selectedOriginalImageUrl) {
      Swal.fire('Error', 'Por favor, selecciona una imagen de refacción y la imagen original.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const uploadedUrl = await uploadImage(newImageFile);
const refactionImagesColRef = collection(db, `/artifacts/${appId}/public/data/properties/${propertyId}/refaccionImages`);
      await addDoc(refactionImagesColRef, {
        newImageUrl: uploadedUrl,
        originalImageUrl: selectedOriginalImageUrl,
        description: description,
        timestamp: serverTimestamp(),
      });

      Swal.fire('¡Éxito!', 'Imagen de refacción agregada correctamente.', 'success');
      setNewImageFile(null);
      setNewImageUrlPreview('');
      setDescription('');
      setSelectedOriginalImageUrl('');

    } catch (error) {
      console.error('Error al agregar imagen de refacción:', error);
      Swal.fire('Error', 'Hubo un problema al subir la imagen de refacción.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-image-form-container">
      <h2 className="add-image-form-container__title">Administrar Imágenes de la Propiedad</h2>

      <div className="add-image-form-container__tabs">
        <button
          className={`add-image-form-container__tab ${activeSection === 'newImages' ? 'add-image-form-container__tab--active' : ''}`}
          onClick={() => setActiveSection('newImages')}
          disabled={isLoading}
        >
          Agregar Imágenes Nuevas
        </button>
        <button
          className={`add-image-form-container__tab ${activeSection === 'refactions' ? 'add-image-form-container__tab--active' : ''}`}
          onClick={() => setActiveSection('refactions')}
          disabled={isLoading}
        >
          Agregar Refacciones (Antes/Después)
        </button>
      </div>

      {activeSection === 'newImages' && (
        <form onSubmit={handleAddRegularImage} className="add-image-form">
          <div className="add-image-form__group">
            <label htmlFor="image-file-regular" className="add-image-form__label">Seleccionar Imagen</label>
            <input
              type="file"
              id="image-file-regular"
              className="add-image-form__input-file"
              accept="image/*"
              onChange={handleNewImageFileChange}
              disabled={isLoading}
              required
            />
          </div>
          {newImageUrlPreview && (
            <div className="add-image-form__image-preview">
             <img src={newImageUrlPreview} alt="Vista previa de nueva imagen"  objectFit="cover" />
            </div>
          )}
          <button type="submit" className="add-image-form__button" disabled={isLoading}>
            {isLoading ? 'Subiendo...' : 'Subir Imagen a Propiedad'}
          </button>
        </form>
      )}

      {activeSection === 'refactions' && (
        <form onSubmit={handleAddRefactionImage} className="add-image-form">
          <div className="add-image-form__group">
            <label htmlFor="image-file-refaction" className="add-image-form__label">Imagen de la Refacción (Después)</label>
            <input
              type="file"
              id="image-file-refaction"
              className="add-image-form__input-file"
              accept="image/*"
              onChange={handleNewImageFileChange}
              disabled={isLoading}
              required
            />
          </div>
          {newImageUrlPreview && (
            <div className="add-image-form__image-preview">
             <img src={newImageUrlPreview} alt="Vista previa de refacción"  objectFit="cover" />
            </div>
          )}

          <div className="add-image-form__group">
            <label className="add-image-form__label">Selecciona la Imagen Original (Antes)</label>
            <div className="add-image-form__original-images-grid">
              {propertyImageUrls.length > 0 ? (
                propertyImageUrls.map((url, index) => (
                  <div
                    key={index}
                    className={`add-image-form__original-image-wrapper ${selectedOriginalImageUrl === url ? 'add-image-form__original-image-wrapper--active' : ''}`}
                    onClick={() => setSelectedOriginalImageUrl(url)}
                  >
                   <img src={url} alt={`Original ${index}`} width={100} height={80} objectFit="cover" />
                  </div>
                ))
              ) : (
                <p>No hay imágenes subidas para esta propiedad.</p>
              )}
            </div>
          </div>
          <div className="add-image-form__group">
            <label htmlFor="refaction-description" className="add-image-form__label">Descripción de la Refacción (Opcional)</label>
            <input
              type="text"
              id="refaction-description"
              className="add-image-form__input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Cambio de pisos en sala"
              disabled={isLoading}
            />
          </div>
          <button type="submit" className="add-image-form__button" disabled={isLoading}>
            {isLoading ? 'Subiendo...' : 'Vincular Refacción'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AddImageForm;