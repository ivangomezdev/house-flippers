// src/components/AddExpenseForm.jsx
'use client';
import { useState } from 'react';
import { db, appId } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Swal from 'sweetalert2';
import './AddExpenseForm.css';
import { uploadImage } from '../lib/imageUpload.js';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const AddExpenseForm = ({ propertyId }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setImagePreview('');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount) {
      Swal.fire('Error', 'Por favor, completa todos los campos.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = '';
      // Solo intentamos subir la imagen si 'imageFile' es realmente un archivo.
      if (imageFile instanceof File) {
        imageUrl = await uploadImage(imageFile);
      }

      const expensesColPath = `/artifacts/${appId}/public/data/properties/${propertyId}/expenses`;

      await addDoc(collection(db, expensesColPath), {
        description: description,
        amount: Number(amount),
        date: serverTimestamp(),
        // Nos aseguramos de guardar la URL o un string vacío.
        imageUrl: imageUrl || '',
      });

      Swal.fire('¡Éxito!', 'Gasto agregado correctamente.', 'success');

      // Limpiamos el formulario
      setDescription('');
      setAmount('');
      setImageFile(null);
      setImagePreview('');
      // Limpiamos el valor del input de archivo para poder seleccionar el mismo otra vez
      document.getElementById('image').value = '';


    } catch (error) {
      console.error("Error al agregar el gasto: ", error);
      Swal.fire('Error', 'Hubo un problema al guardar el gasto.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="expense-form-container">
      <h2 className="expense-form-container__title">Agregar Nuevo Gasto</h2>
      <p className="expense-form-container__subtitle">
        Añade un nuevo gasto de remodelación o mantenimiento para esta propiedad.
      </p>
      <form onSubmit={handleSubmit} className="expense-form">
        <div className="expense-form__group">
          <label htmlFor="description" className="expense-form__label">Descripción</label>
          <input
            type="text"
            id="description"
            className="expense-form__input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: Compra de pintura, pago de fontanero"
            disabled={isLoading}
            required
          />
        </div>
        <div className="expense-form__group">
          <label htmlFor="amount" className="expense-form__label">Monto (USD)</label>
          <input
            type="number"
            id="amount"
            className="expense-form__input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Ej: 150.50"
            disabled={isLoading}
            required
          />
        </div>
        <div className="expense-form__group">
          <label htmlFor="image" className="expense-form__label">Imagen (Opcional)</label>
          <div className="file-input-wrapper">
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              className="file-input"
              accept="image/jpeg,image/png"
              disabled={isLoading}
            />
            <label htmlFor="image" className="file-input-label">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "7px" }}>
                <CloudUploadIcon style={{ color: "#001b4cff", fontSize: "50px" }} />
                <span>Subir foto del gasto</span>
                <p className="formats-text">JPEG, PNG</p>
                <button type="button" className="browse-button">Buscar ▶</button>
              </div>
            </label>
          </div>
          {imagePreview && (
            <div className="add-image-form__image-preview">
              <img src={imagePreview} alt="Vista previa de la imagen" style={{ maxWidth: '200px', marginTop: '10px', borderRadius: '8px' }} />
            </div>
          )}
        </div>
        <button type="submit" className="expense-form__button" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Agregar Gasto'}
        </button>
      </form>
    </div>
  );
};

export default AddExpenseForm;