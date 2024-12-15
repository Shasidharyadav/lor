import React from 'react';
import { Bar } from 'react-chartjs-2';
import "../../styles/global.css";

const Chart = ({ data, options }) => {
  return <Bar data={data} options={options} />;
};

export default Chart;
