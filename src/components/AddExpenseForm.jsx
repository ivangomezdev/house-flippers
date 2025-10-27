'use client';
import { useState } from 'react';
import { db, appId } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Swal from 'sweetalert2';
import './AddExpenseForm.css';

const AddExpenseForm = ({ propertyId }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount) {
      Swal.fire('Error', 'Por favor, completa todos los campos.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // Ruta a la subcolección de gastos
      const expensesColPath = `/artifacts/${appId}/public/data/properties/${propertyId}/expenses`;
      
      // Añadir el nuevo documento de gasto
      await addDoc(collection(db, expensesColPath), {
        description: description,
        amount: Number(amount),
        date: serverTimestamp(), // Usa la fecha del servidor para consistencia
      });

      Swal.fire('¡Éxito!', 'Gasto agregado correctamente.', 'success');
      
      // Limpiar el formulario
      setDescription('');
      setAmount('');

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
        <button type="submit" className="expense-form__button" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Agregar Gasto'}
        </button>
      </form>
    </div>
  );
};

export default AddExpenseForm;