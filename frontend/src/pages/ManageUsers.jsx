import React from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import Table from '../components/Dashboard/Table';
import dummyData from '../utilities/dummyData';
import "../styles/global.css";

const ManageUsers = () => {
  const tableHeaders = ['User ID', 'Username', 'Role', 'Action'];
  const tableRows = dummyData.tables.adminManageUsers.map((user) => [
    user[0],
    user[1],
    user[2],
    <button key={user[0]} onClick={() => alert(`Deleted ${user[1]}`)}>
      Delete
    </button>,
  ]);

  return (
    <DashboardLayout role="admin">
      <h2>Manage Users</h2>
      <Table headers={tableHeaders} rows={tableRows} />
    </DashboardLayout>
  );
};

export default ManageUsers;
