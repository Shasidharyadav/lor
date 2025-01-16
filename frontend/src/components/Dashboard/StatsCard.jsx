import React from 'react';
import "../../styles/global.css";

const StatsCard = ({ title, value, onClick }) => {
  return (
    <div className="stats-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};

export default StatsCard;
