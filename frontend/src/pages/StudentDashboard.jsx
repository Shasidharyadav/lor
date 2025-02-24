// src/pages/StudentDashboard.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import StatsCard from '../components/Dashboard/StatsCard';
import { fetchStudentLorCounts } from '../services/api';

const StudentDashboard = () => {
  document.title = 'Student Dashboard';

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    accepted: 0,
    finished: 0,
    declined: 0,
    expired: 0,
    requestedToDelete: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      if (!user?.id) {
        console.error("No student ID found in localStorage.");
        setLoading(false);
        return;
      }
      try {
        // fetch counts from your backend
        const data = await fetchStudentLorCounts(user.id);
        setStats({
          pending: data.pending || 0,
          accepted: data.accepted || 0,
          finished: data.finished || 0,
          declined: data.declined || 0,
          expired: data.expired || 0,
          requestedToDelete: data.requestedToDelete || 0,
        });
      } catch (error) {
        console.error("Error fetching student LoR stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user.id]);

  /**
   * Handle clicks on a stats card:
   * Navigate to /student/view-requests?status=XYZ
   */
  const handleCardClick = (status) => {
    navigate(`/student/view-requests?status=${status}`);
  };

  if (loading) {
    return (
      <DashboardLayout role={user.role} user={user}>
        <h2>Loading Student Dashboard...</h2>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={user.role} user={user}>
      <h2>Student Dashboard</h2>

      <div className="stats-grid">
        <StatsCard
          title="Pending Requests"
          value={stats.pending}
          onClick={() => handleCardClick("PENDING")}
        />
        <StatsCard
          title="Accepted Requests"
          value={stats.accepted}
          onClick={() => handleCardClick("ACCEPTED")}
        />
        <StatsCard
          title="Finished LORs"
          value={stats.finished}
          onClick={() => handleCardClick("FINISHED")}
        />
        <StatsCard
          title="Declined Requests"
          value={stats.declined}
          onClick={() => handleCardClick("DECLINED")}
        />
        <StatsCard
          title="Expired Requests"
          value={stats.expired}
          onClick={() => handleCardClick("EXPIRED")}
        />
        <StatsCard
          title="Requested to Delete"
          value={stats.requestedToDelete}
          onClick={() => handleCardClick("REQUESTED TO DELETE")}
        />
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
