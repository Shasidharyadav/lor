import React from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import Table from '../components/Dashboard/Table';
import dummyData from '../utilities/dummyData';
import "../styles/global.css";

const PendingRequests = () => {
  const tableHeaders = ['Request ID', 'Status', 'Faculty', 'Reason'];
  const tableRows = dummyData.tables.studentPendingRequests;

  return (
    <DashboardLayout role="student">
      <h2>Pending Requests</h2>
      <Table headers={tableHeaders} rows={tableRows} />
    </DashboardLayout>
  );
};

export default PendingRequests;
