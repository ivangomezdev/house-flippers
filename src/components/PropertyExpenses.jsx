// src/components/PropertyExpenses.jsx
'use client';
import './PropertyExpenses.css';
import Swal from 'sweetalert2';

// Función para formatear la fecha
const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no disponible';
  
  // Creamos un objeto Date a partir del string ISO
  const date = new Date(dateString);
  
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const ImageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
);

const PropertyExpenses = ({ expenses }) => {

  const showImage = (imageUrl) => {
    Swal.fire({
      imageUrl: imageUrl,
      imageWidth: 800,
      imageAlt: 'Expense Image',
      width: 'auto',
      showConfirmButton: false,
      background: '#fff'
    });
  };


  if (!expenses || expenses.length === 0) {
    return (
      <div className="expenses-container">
        <h2>Gastos de Remodelación y Mantenimiento</h2>
        <p className="no-expenses-text">Aún no se han registrado gastos para esta propiedad.</p>
      </div>
    );
  }

  const totalExpenses = expenses.reduce((total, expense) => total + (expense.amount || 0), 0);

  return (
    <div className="expenses-container">
      <h2>Gastos de Remodelación y Mantenimiento</h2>
      <div className="expenses-table-wrapper">
        <table className="expenses-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Monto (USD)</th>
              <th className="image-header">Imagen</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{formatDate(expense.date)}</td>
                <td>{expense.description}</td>
                <td className="amount-cell">${expense.amount.toLocaleString()}</td>
                <td>
                  {expense.imageUrl && (
                    <button onClick={() => showImage(expense.imageUrl)} className="image-button">
                      <ImageIcon />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="total-label">Total de Gastos</td>
              <td className="total-amount">${totalExpenses.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default PropertyExpenses;