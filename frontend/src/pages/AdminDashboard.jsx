import React from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import StatsCard from '../components/Dashboard/StatsCard';
import Chart from '../components/Dashboard/Chart';
import dummyData from '../utilities/dummyData';
import "../styles/global.css";

const AdminDashboard = () => {
  document.title = 'Admin Dashboard';
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const stats = dummyData.stats.admin;
  const chartData = dummyData.chartData;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <DashboardLayout role={user.role} user={user}>
      <h2>Admin Dashboard</h2>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatsCard key={index} title={stat.title} value={stat.value} />
        ))}
      </div>
      <div style={{ height: '300px' }}>
        <Chart data={chartData} options={chartOptions} />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
