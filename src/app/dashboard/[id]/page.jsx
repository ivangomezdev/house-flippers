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
import withAuth from '../../../components/WithAuth';
import './Dashboard.css';

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 0 24 24" width="30px" fill="currentColor">
        <path d="M0 0h24v24H0V0z" fill="none"/><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
    </svg>
);

const MarkAsSold = () => <div className="placeholder-view"><h2>Marcar como Vendida</h2><p>Funcionalidad para marcar la propiedad como vendida próximamente.</p></div>;
const Earnings = () => <div className="placeholder-view"><h2>Ganancias</h2><p>Cálculo de ganancias próximamente.</p></div>;

const DashboardContent = () => {
  const [activeView, setActiveView] = useState('addExpense');
  const [expenses, setExpenses] = useState([]);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const handleViewChange = (view) => {
    setActiveView(view);
    setIsSidebarOpen(false);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'addExpense': return <AddExpenseForm propertyId={propertyId} />;
      case 'addImage': return <AddImageForm propertyId={propertyId} />;
      case 'markAsSold': return <MarkAsSold />;
      case 'totalInvestment': return <TotalInvestment />;
      case 'earnings': return <Earnings />;
      case 'expenses': return loadingExpenses ? <p>Cargando gastos...</p> : <PropertyExpenses expenses={expenses} />;
      default: return <AddExpenseForm propertyId={propertyId} />;
    }
  };

  return (
    <div className="dashboard-layout">
      <button className="dashboard-layout__menu-toggle" onClick={() => setIsSidebarOpen(true)}>
        <MenuIcon />
      </button>
      <Sidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      {isSidebarOpen && <div className="dashboard-layout__overlay" onClick={() => setIsSidebarOpen(false)}></div>}
      <main className="dashboard-layout__main-content">
        {renderActiveView()}
      </main>
    </div>
  );
}

export default withAuth(DashboardContent);