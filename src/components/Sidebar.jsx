'use client';
import Link from 'next/link';
import './Sidebar.css';

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
        <path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
    </svg>
);

const Sidebar = ({ activeView, onViewChange, isOpen, onClose }) => {
  const navLinks = [
    { id: 'addExpense', label: 'Agregar Gasto' },
    { id: 'addImage', label: 'Agregar Imagen' },
    { id: 'markAsSold', label: 'Marcar como Vendida' },
    { id: 'totalInvestment', label: 'Inversión Total' },
    { id: 'earnings', label: 'Ganancias' },
    { id: 'expenses', label: 'Gastos' },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
      <div className="sidebar__header">
        <h2 className="sidebar__title">Dashboard</h2>
        <button className="sidebar__close-btn" onClick={onClose}>
            <CloseIcon />
        </button>
      </div>
      <nav className="sidebar__nav">
        <Link href="/" passHref>
          <button className="sidebar__link sidebar__link--home" onClick={onClose}>
            <HomeIcon />
            <span>Volver al Inicio</span>
          </button>
        </Link>
        <hr className="sidebar__separator" />
        {navLinks.map((link) => (
          <button
            key={link.id}
            className={`sidebar__link ${activeView === link.id ? 'sidebar__link--active' : ''}`}
            onClick={() => onViewChange(link.id)}
          >
            {link.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;