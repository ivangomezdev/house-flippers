'use client';
import { useState, useEffect } from 'react';
import { db, appId } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import StatCard from './StatCard';
import DonutChart from './DonutChart';
import './TotalInvestment.css';

// --- Iconos SVG para las tarjetas ---
const PropertyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>;
const RenovationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6.2 6.2 9 1.6 4.4C.5 6.8.9 9.9 2.9 11.8c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.4-2.4c.4-.4.4-1 0-1.4z" /></svg>;
const TotalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7v-2h4V7h2v4h4v2h-4v4z" /></svg>;
const EarningsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c2.07-.4 3.5-1.6 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" /></svg>;


const TotalInvestment = () => {
  const [stats, setStats] = useState({
    propertyInvestment: 0,
    renovationInvestment: 0,
    totalInvestment: 0,
    earnings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      let propertyTotal = 0;
      let renovationTotal = 0;
      let totalEarnings = 0;

      const propertiesCollectionPath = `/artifacts/${appId}/public/data/properties`;
      const querySnapshot = await getDocs(collection(db, propertiesCollectionPath));

      for (const doc of querySnapshot.docs) {
        const propertyData = doc.data();
        propertyTotal += propertyData.cost || 0;

        if (propertyData.sold && propertyData.sellingPrice) {
            totalEarnings += propertyData.sellingPrice - propertyData.cost;
        }
        
        // --- ✨ ESTA ES LA LÍNEA CORREGIDA ✨ ---
        const expensesCol = collection(doc.ref, 'expenses');
        const expensesSnapshot = await getDocs(expensesCol);
        
        let propertyRenovationTotal = 0;
        expensesSnapshot.forEach(expenseDoc => {
          propertyRenovationTotal += expenseDoc.data().amount || 0;
        });

        renovationTotal += propertyRenovationTotal;
        if (propertyData.sold && propertyData.sellingPrice) {
            totalEarnings -= propertyRenovationTotal;
        }
      }

      setStats({
        propertyInvestment: propertyTotal,
        renovationInvestment: renovationTotal,
        totalInvestment: propertyTotal + renovationTotal,
        earnings: totalEarnings,
      });

      setLoading(false);
    };

    fetchAllData();
  }, []);

  if (loading) {
    return <div className="loading-state">Calculando inversiones...</div>;
  }

  const { propertyInvestment, renovationInvestment, totalInvestment, earnings } = stats;
  const propertyPercentage = totalInvestment > 0 ? Math.round((propertyInvestment / totalInvestment) * 100) : 0;
  const renovationPercentage = totalInvestment > 0 ? Math.round((renovationInvestment / totalInvestment) * 100) : 0;
  const earningsPercentage = totalInvestment > 0 ? Math.round((earnings / totalInvestment) * 100) : 0;

  return (
    <div className="investment-view">
      <h2 className="investment-view__title">Resumen de Inversión</h2>
      
      <div className="investment-view__stats-grid">
        <StatCard title="Total Invertido en Propiedades" amount={stats.propertyInvestment} icon={<PropertyIcon />} />
        <StatCard title="Total Invertido en Refacciones" amount={stats.renovationInvestment} icon={<RenovationIcon />} />
        <StatCard title="Inversión Total Combinada" amount={stats.totalInvestment} icon={<TotalIcon />} />
        <StatCard title="Ganancia Neta (Prop. Vendidas)" amount={stats.earnings} icon={<EarningsIcon />} />
      </div>

      <div className="investment-view__charts-container">
        <DonutChart title="Propiedades" percentage={propertyPercentage} color="#001b4cff" />
        <DonutChart title="Refacciones" percentage={renovationPercentage} color="#FFC107" />
        <DonutChart title="Ganancia / Inversión" percentage={earningsPercentage} color="#2196F3" />
      </div>
    </div>
  );
};

export default TotalInvestment;