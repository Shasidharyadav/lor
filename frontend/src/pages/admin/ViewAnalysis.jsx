import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import { getAnalysis } from '../../services/api';

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

const ViewAnalysis = () => {
    document.title = "Analysis";
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [stats, setStats] = useState({
        studentCountForFiveYrs: {},
        facultyCountByDepartment: {},
        top10UniversityNames: {},
        top10UniversityCountries: {},
    });

    const user = JSON.parse(localStorage.getItem('user')) || {};

    useEffect(() => {
        const fetchData = async() => {
            try {
                const filters = {};
                filters.dept = 'ALL';
                filters.school = 'ALL';
                filters.campus = 'ALL';
                const data = await getAnalysis(filters);
                setStats({
                    studentCountForFiveYrs: data.studentCountForFiveYrs || {},
                    facultyCountByDepartment: data.facultyCountByDepartment || {},
                    top10UniversityNames: data.top10UniversityNames || {},
                    top10UniversityCountries: data.top10UniversityCountries || {},
                });
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchData();
    });

    if (loading) {
        return (
          <DashboardLayout role={user.role} user={user}>
            <h2>Admin Dashboard</h2>
            <p>Loading data...</p>
          </DashboardLayout>
        );
    }
    
    if (error) {
        return (
          <DashboardLayout role={user.role} user={user}>
            <h2>Admin Dashboard</h2>
            <p style={{ color: 'red' }}>Error: {error}</p>
          </DashboardLayout>
        );
    }

    // Generate last 5 years including the current year
    const currentYear = new Date().getFullYear();
    const pastFiveYears = Array.from({ length: 5 }, (_, i) => currentYear - 4 + i);

    // Prepare dataset ensuring missing years default to 0
    const studentCounts = pastFiveYears.map(
        (year) => stats.studentCountForFiveYrs[year] || 0
    );


    // Bar chart data
    const studentFiveYrsData = {
        labels: pastFiveYears, // X-axis labels (Years)
        datasets: [
            {
                label: "Students Requesting LoRs",
                data: studentCounts, // Y-axis values
                backgroundColor: "rgba(0, 116, 103, 1)", // Blue bars
                borderColor: "rgba(0, 89, 70, 1)",
                borderWidth: 1,
            }
        ]
    };

    const facultyCountByDepartmentData = {
        labels: Object.keys(stats.facultyCountByDepartment),
        datasets: [
            {
                label: "Faculty Count",
                data: Object.values(stats.facultyCountByDepartment),
                backgroundColor: "rgba(0, 116, 103, 1)", // Blue bars
                borderColor: "rgba(0, 89, 70, 1)",
                borderWidth: 1,
            }
        ]
    };

    const top10UniversityNamesData = {
        labels: Object.keys(stats.top10UniversityNames),
        datasets: [
            {
                label: "University Count",
                data: Object.values(stats.top10UniversityNames),
                backgroundColor: "rgba(0, 116, 103, 1)", // Blue bars
                borderColor: "rgba(0, 89, 70, 1)",
                borderWidth: 1,
            }
        ]
    };

    const top10UniversityCountriesData = {
        labels: Object.keys(stats.top10UniversityCountries),
        datasets: [
            {
                label: "University Country Count",
                data: Object.values(stats.top10UniversityCountries),
                backgroundColor: "rgba(0, 116, 103, 1)", // Blue bars
                borderColor: "rgba(0, 89, 70, 1)",
                borderWidth: 1,
            }
        ]
    }

    // Chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 100, 
            easing: "linear", // Makes it move at a constant speed
        },
        plugins: {
            tooltip: {
                mode: 'nearest', // Faster tooltip rendering
                intersect: false, // Show tooltip even when hovering nearby
                animation: false, // Disable tooltip animation for responsiveness
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: Math.ceil(Math.max(...studentCounts) / 5), // Auto-adjust
                }
            }
        }
    };

    return (
        <DashboardLayout>
            <h2 className='header-container'>
                Analysis
            </h2>
            <div className="charts-grid" style={{ marginTop: '2rem' }}>
                <div className='chart-card'>
                    <h4>No. of Students requesting LoRs vs Year</h4>
                    <hr className="chart-description-line" />
                    <div className='chart-wrapper'>
                        <Bar data={studentFiveYrsData} options={chartOptions} />
                    </div>
                </div>
                <div className='chart-card'>
                    <h4>No. of Faculty giving LoRs vs Dept.</h4>
                    <hr className="chart-description-line" />
                    <div className='chart-wrapper'>
                        <Bar data={facultyCountByDepartmentData} options={chartOptions} />
                    </div>
                </div>
            </div>
            <div className='chart-card'>
                <h4>Top 10 Universities students wish to apply</h4>
                <hr className="chart-description-line" />
                <div className='chart-wrapper'>
                    <Bar data={top10UniversityNamesData} options={chartOptions} />
                </div>
            </div>
            <div className='chart-card'>
                <h4>Top 10 University Countries students wish to apply</h4>
                <hr className="chart-description-line" />
                <div className='chart-wrapper'>
                    <Bar data={top10UniversityCountriesData} options={chartOptions} />
                </div>
            </div>
        </DashboardLayout>
    )
}

export default ViewAnalysis;
