// src/components/PropertyExpenses.jsx
'use client';
import './PropertyExpenses.css';

// Función para formatear la fecha (puedes ajustarla a tu gusto)
const formatDate = (timestamp) => {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  return 'Fecha no disponible';
};

const PropertyExpenses = ({ expenses }) => {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="expenses-container">
        <h2>Gastos de Remodelación y Mantenimiento</h2>
        <p className="no-expenses-text">Aún no se han registrado gastos para esta propiedad.</p>
      </div>
    );
  }

  // Calculamos el total de los gastos
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
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{formatDate(expense.date)}</td>
                <td>{expense.description}</td>
                <td className="amount-cell">${expense.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2" className="total-label">Total de Gastos</td>
              <td className="total-amount">${totalExpenses.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default PropertyExpenses;