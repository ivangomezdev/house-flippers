import './DonutChart.css';

const DonutChart = ({ title, percentage, color }) => {
  const strokeDashoffset = 283 - (283 * percentage) / 100; // 283 es la circunferencia del círculo

  return (
    <div className="donut-chart">
      <svg className="donut-chart__svg" viewBox="0 0 100 100">
        <circle className="donut-chart__background" cx="50" cy="50" r="45" />
        <circle
          className="donut-chart__progress"
          cx="50" cy="50" r="45"
          stroke={color}
          style={{ strokeDashoffset }}
        />
        <text className="donut-chart__percentage" x="50" y="50">
          {percentage}%
        </text>
      </svg>
      <p className="donut-chart__title">{title}</p>
    </div>
  );
};

export default DonutChart;