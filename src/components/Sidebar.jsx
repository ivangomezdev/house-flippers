'use client';
import './Sidebar.css';

const Sidebar = ({ activeView, setActiveView }) => {
  const navLinks = [
    { id: 'addExpense', label: 'Agregar Gasto' },
    { id: 'addImage', label: 'Agregar Imagen' },
    { id: 'markAsSold', label: 'Marcar como Vendida' },
    { id: 'totalInvestment', label: 'Inversión Total' },
    { id: 'earnings', label: 'Ganancias' },
  ];

  return (
    <aside className="sidebar">
      <h2 className="sidebar__title">Dashboard</h2>
      <nav className="sidebar__nav">
        {navLinks.map((link) => (
          <button
            key={link.id}
            className={`sidebar__link ${activeView === link.id ? 'sidebar__link--active' : ''}`}
            onClick={() => setActiveView(link.id)}
          >
            {link.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;