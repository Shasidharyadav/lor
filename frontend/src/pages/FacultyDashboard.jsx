import React from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import StatsCard from '../components/Dashboard/StatsCard';
import Table from '../components/Dashboard/Table';
import dummyData from '../utilities/dummyData';
import "../styles/global.css";

const TeacherDashboard = () => {
  const stats = dummyData.stats.teacher;
  const tableHeaders = ['Request ID', 'Student Name', 'Reason'];
  const tableRows = dummyData.tables.teacherRequests;

  return (
    <DashboardLayout role="teacher">
      <h2>Teacher Dashboard</h2>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatsCard key={index} title={stat.title} value={stat.value} />
        ))}
      </div>
      <Table headers={tableHeaders} rows={tableRows} />
    </DashboardLayout>
  );
};

export default TeacherDashboard;
