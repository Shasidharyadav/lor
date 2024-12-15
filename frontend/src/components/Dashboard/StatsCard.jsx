import React from 'react';
import "../../styles/global.css";

const StatsCard = ({ title, value }) => {
  return (
    <div className="stats-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};

export default StatsCard;
