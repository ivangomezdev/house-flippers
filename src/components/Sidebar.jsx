'use client';
import Link from 'next/link';
import './Sidebar.css';

// Icono SVG para el enlace de inicio
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);




const Sidebar = ({ activeView, setActiveView }) => {
  const navLinks = [
    { id: 'addExpense', label: 'Agregar Gasto' },
    { id: 'addImage', label: 'Agregar Imagen' },
    { id: 'markAsSold', label: 'Marcar como Vendida' },
    { id: 'totalInvestment', label: 'Inversión Total' },
    { id: 'earnings', label: 'Ganancias' },
    { id: 'expenses', label: 'Gastos' },
  ];

  return (
    <aside className="sidebar">
      <h2 className="sidebar__title">Dashboard</h2>
      <nav className="sidebar__nav">
        {/* Enlace para volver al Home */}
        <Link href="/" passHref>
          <button className="sidebar__link sidebar__link--home">
            <HomeIcon />
            <span>Volver al Inicio</span>
          </button>
        </Link>

        {/* Separador visual */}
        <hr className="sidebar__separator" />

        {navLinks.map((link) => (
          <button
            key={link.id}
            className={`sidebar__link ${activeView === link.id ? 'sidebar__link--active' : ''}`}
            onClick={() => setActiveView(link.id)}
          >
            {link.icon}
            {link.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;