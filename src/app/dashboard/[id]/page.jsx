'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import AddExpenseForm from '../../../components/AddExpenseForm';
import AddImageForm from '../../../components/AddImageForm';
import TotalInvestment from '../../../components/TotalInvestmen';
import PropertyExpenses from '../../../components/PropertyExpenses';
import { db, appId } from '../../../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';


import './Dashboard.css';

// --- Componentes de marcador de posición para las otras vistas ---
const MarkAsSold = () => <div className="placeholder-view"><h2>Marcar como Vendida</h2><p>Funcionalidad para marcar la propiedad como vendida próximamente.</p></div>;
const Earnings = () => <div className="placeholder-view"><h2>Ganancias</h2><p>Cálculo de ganancias próximamente.</p></div>;


export default function DashboardPage() {
  const [activeView, setActiveView] = useState('addExpense');
  const [expenses, setExpenses] = useState([]);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const params = useParams();
  const propertyId = params.id;

  useEffect(() => {
    if (!propertyId) return;

    const expensesColPath = `/artifacts/${appId}/public/data/properties/${propertyId}/expenses`;
    const unsubscribe = onSnapshot(collection(db, expensesColPath), (snapshot) => {
      const expensesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExpenses(expensesList);
      setLoadingExpenses(false);
    }, (error) => {
      console.error("Error fetching expenses: ", error);
      setLoadingExpenses(false);
    });

    return () => unsubscribe();
  }, [propertyId]);

  const renderActiveView = () => {
    switch (activeView) {
      case 'addExpense':
        return <AddExpenseForm propertyId={propertyId} />;
      case 'addImage':
        return <AddImageForm propertyId={propertyId} />;
      case 'markAsSold':
        return <MarkAsSold />;
      case 'totalInvestment':
        return <TotalInvestment />;
      case 'earnings':
        return <Earnings />;
      case 'expenses':
        return loadingExpenses ? <p>Cargando gastos...</p> : <PropertyExpenses expenses={expenses} />;
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