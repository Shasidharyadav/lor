// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import StatsCard from '../components/Dashboard/StatsCard';
import { fetchAdminDashboardStats } from '../services/api'; // your centralized admin API
import "../styles/global.css";
import "../styles/AdminDashboard.css";

// Chart imports
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from "chart.js";
import { Pie, Bar, Doughnut, Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const AdminDashboard = () => {
  document.title = 'Admin Dashboard';
  const navigate = useNavigate();

  // High-level stats
  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    admins: 0,
    totalUsers: 0
  });

  // Distribution arrays
  const [campusDistribution, setCampusDistribution] = useState([]); 
  const [branchDistribution, setBranchDistribution] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem('user')) || {};

  // Fetch data from backend (only if we want to show for admin)
  useEffect(() => {
    // If the user is admin, we fetch stats.
    if (user.role === 'admin') {
      const fetchStatsData = async () => {
        try {
          const data = await fetchAdminDashboardStats(); 
          // Example shape:
          // {
          //   stats: { students, faculty, admins, totalUsers },
          //   campusDistribution: [{ campus, students, faculty, admins }, ...],
          //   branchDistribution: [{ branch, students, faculty }, ...],
          // }

          setStats({
            students: data.stats.students || 0,
            faculty: data.stats.faculty || data.stats.teachers || 0,
            admins: data.stats.admins || 0,
            totalUsers: data.stats.totalUsers || 0
          });

          setCampusDistribution(data.campusDistribution || []);
          setBranchDistribution(data.branchDistribution || []);

          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
      fetchStatsData();
    } else {
      // If user is department_admin, we skip fetching (no stats).
      setLoading(false);
    }
  }, [user.role]);

  // Quick loading/error states
  if (loading) {
    return (
      <DashboardLayout role={user.role} user={user}>
        <h2>{user.role === 'admin' ? 'Admin' : 'Department Admin'} Dashboard</h2>
        <p>Loading data...</p>
      </DashboardLayout>
    );
  }

  if (error && user.role === 'admin') {
    return (
      <DashboardLayout role={user.role} user={user}>
        <h2>Admin Dashboard</h2>
        <p style={{ color: 'red' }}>Error: {error}</p>
      </DashboardLayout>
    );
  }

  // ---------------------------------------
  // DEPARTMENT_ADMIN VIEW
  // Just two cards: "Add HOD" and "LoR Requests"
  // ---------------------------------------
  if (user.role === 'department_admin') {
    const handleNavigateAddHOD = () => navigate('/admin/manage-hod');
    const handleNavigateLoRRequests = () => navigate('/admin/Lor-request');

    return (
      <DashboardLayout role={user.role} user={user}>
        <h2>Department Admin Dashboard</h2>

        {/* 2 Stats Cards with onClick navigation */}
        <div className="stats-grid">
          <StatsCard
            title="Add HOD"
            onClick={handleNavigateAddHOD}
          />
          <StatsCard
            title="LoR Requests"
            onClick={handleNavigateLoRRequests}
          />
        </div>
      </DashboardLayout>
    );
  }

  // ---------------------------------------
  // ADMIN VIEW
  // Show full stats, distribution tables, charts, etc.
  // ---------------------------------------

  // Navigation Handlers for the Stats Cards
  const handleNavigateStudents = () => navigate('/admin/all-students');
  const handleNavigateFaculty = () => navigate('/admin/all-faculty');
  const handleNavigateAdmins = () => navigate('/admin/all-users?role=admin');
  const handleNavigateAllUsers = () => navigate('/admin/all-users');

  // 1) Pie Chart: Overall distribution among Students/Faculty/Admins
  const pieData = {
    labels: ["Students", "Faculty", "Admins"],
    datasets: [
      {
        label: "Overall Distribution",
        data: [stats.students, stats.faculty, stats.admins],
        backgroundColor: ["#007bff", "#28a745", "#dc3545"]
      }
    ]
  };

  // 2) Bar Chart (Campus-wise) – Stacked
  const campusLabels = campusDistribution.map(item => item.campus);
  const campusStudents = campusDistribution.map(item => item.students);
  const campusFaculty = campusDistribution.map(item => item.faculty);
  const campusAdmins = campusDistribution.map(item => item.admins);

  const campusBarData = {
    labels: campusLabels,
    datasets: [
      {
        label: "Students",
        data: campusStudents,
        backgroundColor: "#007bff"
      },
      {
        label: "Faculty",
        data: campusFaculty,
        backgroundColor: "#28a745"
      },
      {
        label: "Admins",
        data: campusAdmins,
        backgroundColor: "#dc3545"
      }
    ]
  };

  const campusBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true }
    }
  };

  // 3) Doughnut Chart: Branch wise (just Students vs. Faculty)
  const totalBranchStudents = branchDistribution.reduce((sum, b) => sum + (b.students || 0), 0);
  const totalBranchFaculty = branchDistribution.reduce((sum, b) => sum + (b.faculty || 0), 0);

  const doughnutData = {
    labels: ["All Branch Students", "All Branch Faculty"],
    datasets: [
      {
        label: "Branch Distribution (All Branches)",
        data: [totalBranchStudents, totalBranchFaculty],
        backgroundColor: ["#ffc107", "#6c757d"]
      }
    ]
  };

  // 4) Line Chart: Compare each branch's Students vs. Faculty
  const branchLabels = branchDistribution.map(b => b.branch);
  const branchStudentsData = branchDistribution.map(b => b.students);
  const branchFacultyData = branchDistribution.map(b => b.faculty);

  const lineData = {
    labels: branchLabels,
    datasets: [
      {
        label: "Branch Students",
        data: branchStudentsData,
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.1)"
      },
      {
        label: "Branch Faculty",
        data: branchFacultyData,
        borderColor: "#28a745",
        backgroundColor: "rgba(40, 167, 69, 0.1)"
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };

  return (
    <DashboardLayout role={user.role} user={user}>
      <h2>Admin Dashboard</h2>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          title="Total Students"
          value={stats.students}
          onClick={handleNavigateStudents}
        />
        <StatsCard
          title="Total Faculty"
          value={stats.faculty}
          onClick={handleNavigateFaculty}
        />
        <StatsCard
          title="Total Admins"
          value={stats.admins}
          onClick={handleNavigateAdmins}
        />
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          onClick={handleNavigateAllUsers}
        />
      </div>

      {/* CAMPUS-WISE TABLE */}
      <h3>Campus-Wise Distribution</h3>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Campus</th>
            <th>Students</th>
            <th>Faculty</th>
            <th>Admins</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {campusDistribution.map((camp, idx) => {
            const total = (camp.students || 0) 
                        + (camp.faculty || 0) 
                        + (camp.admins || 0);
            return (
              <tr key={idx}>
                <td>{camp.campus}</td>
                <td>{camp.students}</td>
                <td>{camp.faculty}</td>
                <td>{camp.admins}</td>
                <td>{total}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* BRANCH-WISE TABLE */}
      <h3>Branch-Wise Distribution</h3>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Branch</th>
            <th>Students</th>
            <th>Faculty</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {branchDistribution.map((br, idx) => {
            const total = (br.students || 0) + (br.faculty || 0);
            return (
              <tr key={idx}>
                <td>{br.branch}</td>
                <td>{br.students}</td>
                <td>{br.faculty}</td>
                <td>{total}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* CHARTS SECTION */}
      <div className="charts-grid" style={{ marginTop: '2rem' }}>
        {/* Chart #1: Pie (Students/Faculty/Admins) */}
        <div className="chart-card">
          <h4>Overall User Distribution (Pie)</h4>
          <hr className="chart-description-line" />
          <p className="chart-description-text">
            This chart shows the overall distribution of Students, Faculty, and Admins across the university.
          </p>
          <div className="chart-wrapper">
            <Pie data={pieData} options={chartOptions} />
          </div>
        </div>

        {/* Chart #2: Campus-Wise Stacked Bar */}
        <div className="chart-card">
          <h4>Campus-Wise Distribution (Bar)</h4>
          <hr className="chart-description-line" />
          <p className="chart-description-text">
            A stacked bar chart comparing Students, Faculty, and Admins in each campus.
          </p>
          <div className="chart-wrapper">
            <Bar data={campusBarData} options={campusBarOptions} />
          </div>
        </div>

        {/* Chart #3: Doughnut (All Branch Students vs. Faculty) */}
        <div className="chart-card">
          <h4>All Branch Comparison (Doughnut)</h4>
          <hr className="chart-description-line" />
          <p className="chart-description-text">
            Compares total Students vs. total Faculty across all branches combined.
          </p>
          <div className="chart-wrapper">
            <Doughnut data={doughnutData} options={chartOptions} />
          </div>
        </div>

        {/* Chart #4: Line Chart (Branch-wise Students/Faculty) */}
        <div className="chart-card">
          <h4>Branch-Wise Students vs. Faculty (Line)</h4>
          <hr className="chart-description-line" />
          <p className="chart-description-text">
            A line chart plotting each branch along the X-axis, comparing Students vs. Faculty counts.
          </p>
          <div className="chart-wrapper">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
