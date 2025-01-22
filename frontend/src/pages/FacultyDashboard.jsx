// src/pages/TeacherDashboard.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import StatsCard from '../components/Dashboard/StatsCard';
import { fetchTeacherLorCounts } from '../services/api';

const TeacherDashboard = () => {
  document.title = 'Faculty Dashboard';

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    finished: 0,
    declined: 0,
    expired: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      if (!user?.id) {
        console.error("No teacher ID found in localStorage.");
        setLoading(false);
        return;
      }
      try {
        // Example: fetch teacher stats from backend
        const data = await fetchTeacherLorCounts(user.id);
        setStats({
          pending: data.pending || 0,
          approved: data.approved || 0,
          finished: data.finished || 0,
          declined: data.declined || 0,
          expired: data.expired || 0,
        });
      } catch (error) {
        console.error("Error fetching teacher LoR stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user.id]);

  /**
   * Handle clicks on a stats card:
   * e.g., Navigate to /teacher/view-requests?status=XYZ
   */
  const handleCardClick = (status) => {
    navigate(`/teacher/accept-lor?status=${status}`);
  };

  if (loading) {
    return (
      <DashboardLayout role={user.role} user={user}>
        <h2>Loading Teacher Dashboard...</h2>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={user.role} user={user}>
      <h2>Teacher Dashboard</h2>

      <div className="stats-grid">
        <StatsCard
          title="Pending Requests"
          value={stats.pending}
          onClick={() => handleCardClick("PENDING")}
        />
        <StatsCard
          title="Approved Requests"
          value={stats.approved}
          onClick={() => handleCardClick("APPROVED")}
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
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
