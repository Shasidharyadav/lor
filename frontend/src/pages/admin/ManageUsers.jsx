// src/pages/Admin/ManageUsersPage.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import { fetchAllUsers, deleteUser } from '../../services/api';
import '../../styles/global.css'; // .custom-table
import './TableStyles.css';

const ManageUsersPage = () => {
  document.title = "Manage Users | Admin";
  const user = JSON.parse(localStorage.getItem('user')) || {};

  // Filters
  const [roleFilter, setRoleFilter] = useState("");
  const [nameSearch, setNameSearch] = useState("");

  // Data
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch from backend with role filter
  const fetchUsersData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAllUsers(roleFilter);
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Re-fetch if roleFilter changes
  useEffect(() => {
    fetchUsersData();
    // eslint-disable-next-line
  }, [roleFilter]);

  // Apply name-based filter on the client side
  useEffect(() => {
    let temp = [...users];
    if (nameSearch.trim()) {
      const searchLower = nameSearch.toLowerCase();
      temp = temp.filter(u => 
        (u.name && u.name.toLowerCase().includes(searchLower)) ||
        (u.gitamEmail && u.gitamEmail.toLowerCase().includes(searchLower)) ||
        (u.id && u.id.toLowerCase().includes(searchLower))
      );
    }
    setFilteredUsers(temp);
  }, [users, nameSearch]);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId);
      fetchUsersData(); // refresh list after delete
    } catch (err) {
      setError(err.message);
    }
  };

  const tableHeaders = ["ID", "Name", "Email", "Role", "Actions"];

  return (
    <DashboardLayout role={user.role} user={user}>
      <h2>Manage Users</h2>
      {error && <p className="error-message">{error}</p>}
      {loading && <p>Loading...</p>}

      {/* Filter bar: Role filter + Name search */}
      <div className="filter-bar">
        <div className="filter-group">
          <label>Role</label>
          <select
            className="filter-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Search by Name or Email</label>
          <input
            className="filter-input"
            type="text"
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
            placeholder="Type name or email"
          />
        </div>
      </div>

      {filteredUsers.length > 0 ? (
        <table className="custom-table">
          <thead>
            <tr>
              {tableHeaders.map((h, i) => <th key={i}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u, i) => (
              <tr key={i}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.gitamEmail}</td>
                <td>{u.role}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(u.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p className="no-requests-message">No users found.</p>
      )}
    </DashboardLayout>
  );
};

export default ManageUsersPage;
