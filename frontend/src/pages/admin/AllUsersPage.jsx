// src/pages/Admin/AllUsersPage.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import { fetchAllUsers } from '../../services/api'; // Centralized admin API
import '../../styles/global.css'; // Reuse your .custom-table styling

const AllUsersPage = () => {
  document.title = "All Users | Admin";
  const user = JSON.parse(localStorage.getItem('user')) || {};

  // Filters
  const [roleFilter, setRoleFilter] = useState("");
  const [nameSearch, setNameSearch] = useState("");

  // Data
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all users from the backend (optionally filtered by role)
  const fetchUsersData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAllUsers(roleFilter);
      const all = data.users || [];
      setUsers(all);
      // We'll apply nameSearch on the client side below
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

  // Apply name-based filtering on the client side
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

  const tableHeaders = ["ID", "Name", "Email", "Role"];

  return (
    <DashboardLayout role={user.role} user={user}>
      <h2>All Users</h2>

      {/* FILTER BAR */}
      <div className="filter-bar" style={{ marginBottom: '1rem' }}>
        {/* Role Filter */}
        <div className="filter-group">
          <label>Role</label>
          <select
            className="filter-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="student">Students</option>
            <option value="teacher">Faculty</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        {/* Name Search */}
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

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {filteredUsers.length > 0 ? (
        <table className="custom-table">
          <thead>
            <tr>
              {tableHeaders.map((h) => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u, idx) => (
              <tr key={`user-${idx}`}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.gitamEmail}</td>
                <td>{u.role === 'teacher' ? 'Faculty' : u.role.charAt(0).toUpperCase() + u.role.slice(1)}</td>
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

export default AllUsersPage;
