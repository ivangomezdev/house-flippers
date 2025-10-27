import './StatCard.css';

const StatCard = ({ title, amount, icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-card__icon-wrapper">
        {icon}
      </div>
      <div className="stat-card__info">
        <h3 className="stat-card__title">{title}</h3>
        <p className="stat-card__amount">${amount.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default StatCard;