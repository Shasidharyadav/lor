import React from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import "../styles/global.css";

const GenerateReports = () => {
  return (
    <DashboardLayout role="admin">
      <h2>Generate Reports</h2>
      <button onClick={() => alert('Report Generated!')}>Generate Report</button>
    </DashboardLayout>
  );
};

export default GenerateReports;
