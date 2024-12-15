import React from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import StatsCard from '../components/Dashboard/StatsCard';
import Table from '../components/Dashboard/Table';
import dummyData from '../utilities/dummyData';
import "../styles/global.css";

const StudentDashboard = () => {
  const stats = dummyData.stats.student;
  const tableHeaders = ['Request ID', 'Status', 'Faculty Name'];
  const tableRows = dummyData.tables.studentPendingRequests;

  return (
    <DashboardLayout role="student">
      <h2>Student Dashboard</h2>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatsCard key={index} title={stat.title} value={stat.value} />
        ))}
      </div>
      <Table headers={tableHeaders} rows={tableRows} />
    </DashboardLayout>
  );
};

export default StudentDashboard;
