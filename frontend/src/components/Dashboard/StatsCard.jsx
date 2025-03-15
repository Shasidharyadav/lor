import React from 'react';
import "../../styles/global.css";

const StatsCard = ({ title, value, img, onClick }) => {
  return (
    <div className="stats-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className='stats-card-img'><img src={img}/></div>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};

export default StatsCard;
