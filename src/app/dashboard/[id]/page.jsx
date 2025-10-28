'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import AddExpenseForm from '../../../components/AddExpenseForm';
import AddImageForm from '../../../components/AddImageForm'; // <-- NUEVO IMPORT
import TotalInvestment from '../../../components/TotalInvestmen';
import './Dashboard.css';

// --- Componentes de marcador de posición para las otras vistas ---
const MarkAsSold = () => <div className="placeholder-view"><h2>Marcar como Vendida</h2><p>Funcionalidad para marcar la propiedad como vendida próximamente.</p></div>;
const Earnings = () => <div className="placeholder-view"><h2>Ganancias</h2><p>Cálculo de ganancias próximamente.</p></div>;


export default function DashboardPage() {
  const [activeView, setActiveView] = useState('addExpense');
  const params = useParams();
  const propertyId = params.id;

  const renderActiveView = () => {
    switch (activeView) {
      case 'addExpense':
        return <AddExpenseForm propertyId={propertyId} />;
      case 'addImage':
        return <AddImageForm propertyId={propertyId} />; // <-- USAMOS EL NUEVO COMPONENTE
      case 'markAsSold':
        return <MarkAsSold />;
      case 'totalInvestment':
        return <TotalInvestment />;
      case 'earnings':
        return <Earnings />;
      default:
        return <AddExpenseForm propertyId={propertyId} />;
    }
  };

  return (
    <>
      <div className="dashboard-layout">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="dashboard-layout__main-content">
          {renderActiveView()}
        </main>
      </div>
    </>
  );
}