import React, { useContext, useEffect, useState } from 'react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import { SidebarContext } from '../../components/Shared/SidebarContext';
import { getAnalysis } from '../../services/api';
import { 
    campusToSchools, 
    allDepartments, 
  } from '../../utilities/filterData';

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
    const [school, setSchool] = useState("");
    const [department, setDepartment] = useState("");
    const {collapsed, setcollapsed} = useContext(SidebarContext);

    const [stats, setStats] = useState({
        studentCountForFiveYrs: {},
        studentCountAppliedVsNot: {},
        facultyCountByDepartment: {},
        top10FacultyCountByDepartment: {},
        top10UniversityNames: {},
        top10UniversityCountries: {},
        resultFacultyCountByStudentSchool: {},
    });
    

    const user = JSON.parse(localStorage.getItem('user')) || {};

    useEffect(() => {
        const fetchData = async() => {
            try {
                const filters = {};
                filters.id = user.id;
                filters.school = school;
                filters.dept = department;
                const data = await getAnalysis(filters);
                setStats({
                        studentCountForFiveYrs: data.studentCountForFiveYrs || {},
                        studentCountAppliedVsNot: data.studentCountAppliedVsNot || {},
                        facultyCountByDepartment: data.facultyCountByDepartment || {},
                        top10FacultyCountByDepartment: data.top10FacultyCountByDepartment || {},
                        top10UniversityNames: data.top10UniversityNames || {},
                        top10UniversityCountries: data.top10UniversityCountries || {},
                        resultFacultyCountByStudentSchool: data.resultFacultyCountByStudentSchool || {},
                });
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchData();
    });

    // Handle school selection
  const handleSchoolChange = (e) => {
    setSchool(e.target.value);
    setDepartment("");
  };

    // Handle department selection
    const handleDepartmentChange = (e) => {
        setDepartment(e.target.value);
    };

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
                data: Object.values(stats.facultyCountByDepartment),
                backgroundColor: [
                    "#007467", "#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", 
                    "#9966ff", "#ff9f40", "#e74c3c", "#8e44ad", "#2ecc71"
                ],
            }
        ]
    };

    const facultyPieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 100, 
            easing: "linear", // Makes it move at a constant speed
        },
        plugins: {
            legend: { display: false } // Removes legend only for this graph
        }
    };

    const studentCountAppliedVsNotData = {
        labels: ["Applied", "Not Applied"],
        datasets: [
            {
              data: [stats.studentCountAppliedVsNot.Applied, stats.studentCountAppliedVsNot.NotApplied],
              backgroundColor: ["#007467", "#666d73"]
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
                // barPercentage: 1,
                // categoryPercentage: 0.6,
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
                barPercentage: 1, // Controls the width of individual bars
                // categoryPercentage: 0.6,
            }
        ]
    }


    const top10FacultyCountByDepartmentData = {
        labels: Object.keys(stats.top10FacultyCountByDepartment),
        datasets: [
            {
                label: "Faculty Count",
                data: Object.values(stats.top10FacultyCountByDepartment),
                backgroundColor: "rgba(0, 116, 103, 1)", // Blue bars
                borderColor: "rgba(0, 89, 70, 1)",
                borderWidth: 1,
                // barPercentage: 1,
                // categoryPercentage: 0.6,
            }
        ]
    };

    const facultyCountBySchoolData = {
        labels: Object.keys(stats.resultFacultyCountByStudentSchool),
        datasets: [
            {
                data: Object.values(stats.resultFacultyCountByStudentSchool),
                backgroundColor: [
                    "#007467", "#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", 
                    "#9966ff", "#ff9f40", "#e74c3c", "#8e44ad", "#2ecc71"
                ],
            }
        ]
    };


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
            },
            legend: { position: 'bottom' }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: Math.max(1, Math.ceil(Math.max(...studentCounts) / 5)),
                }
            }
        }
    };

    return (
        <DashboardLayout>
            <div className={`graph-page-wrapper ${collapsed ? '' : 'not-collapsed'}`}>
            <h2 className='header-container'>
                Analysis
            </h2>
            {user.status === 'HOI' && (
                <>
                    {/* Filter Bar */}
                    <div className="filter-bar">
                        {/* School */}
                        <div className="filter-group">
                            <label className='labels'>School</label>
                            <select
                                className="credentials dropdown"
                                value={school}
                                onChange={handleSchoolChange}
                            >
                                <option value="">All</option>
                                {user.campus && campusToSchools[user.campus]?.map((sch) => (
                                  <option key={sch} value={sch}>{sch}</option>
                                ))}
                            </select>
                        </div>
                    
                        {/* Department */}
                        <div className="filter-group">
                            <label className='labels'>Department</label>
                            <select
                                className="credentials dropdown"
                                value={department}
                                onChange={handleDepartmentChange}
                                disabled={!school}
                            >
                                <option value="">All</option>
                                {school && allDepartments[school]?.map((dept) => (
                                  <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    </>
                    )}
                    <div className={`charts-grid ${collapsed ? '' : 'not-collapsed'}`} style={{ marginTop: '2rem' }}>
                        <div className={`chart-card ${collapsed ? '' : 'not-collapsed'}`}>
                            <h4>No. of Students requesting LoRs vs Year
                                {Object.keys(stats.studentCountForFiveYrs).length === 0 && (
                                    <p style={{color:"var(--inactive-btn-color)", fontSize: "12px"}}><i>*No data available.</i></p>
                                )}
                            </h4>
                            <hr className="chart-description-line"/>
                            <div className="chart-wrapper">
                                <Bar data={studentFiveYrsData} options={chartOptions} />
                            </div>
                        </div>
                        <div className={`chart-card ${collapsed ? '' : 'not-collapsed'}`}>
                            <h4>Top 10 Faculty Departments giving LoRs
                                {Object.keys(stats.top10FacultyCountByDepartment).length === 0 && (
                                    <p style={{color:"var(--inactive-btn-color)", fontSize: "12px"}}><i>*No data available.</i></p>
                                )}
                            </h4>
                            <hr className="chart-description-line"/>
                            <div className="chart-wrapper">
                                <Bar data={top10FacultyCountByDepartmentData} options={chartOptions} />
                            </div>
                        </div>
                    </div>
                    <div className={`charts-grid ${collapsed ? '' : 'not-collapsed'}`} style={{ marginTop: '2rem' }}>
                        <div className={`chart-card ${collapsed ? '' : 'not-collapsed'}`}>
                        <h4>Students Applied vs Not Applied for LoRs
                            {Object.values(stats.studentCountAppliedVsNot.Applied).length === 0 && Object.values(stats.studentCountAppliedVsNot.NotApplied).length === 0 && (    
                                <p style={{color:"var(--inactive-btn-color)", fontSize: "12px"}}><i>*No data available.</i></p>
                            )}
                        </h4>
                            <hr className="chart-description-line"/>
                            <div className="chart-wrapper">
                                <Doughnut data={studentCountAppliedVsNotData} chartOptions={chartOptions} />
                            </div>
                        </div>
                        {user.status === 'HOI' && (
                        <div className={`chart-card ${collapsed ? '' : 'not-collapsed'}`}>
                            <h4>Number of Faculty giving LoRs Vs Department
                                {Object.keys(stats.facultyCountByDepartment).length === 0 && (
                                    <p style={{color:"var(--inactive-btn-color)", fontSize: "12px"}}><i>*No data available.</i></p>
                                )}
                            </h4>
                            <hr className="chart-description-line"/>
                            <div className="chart-wrapper">
                                <Pie data={facultyCountByDepartmentData} options={facultyPieChartOptions} />
                            </div>
                        </div>
                        )}
                    </div>
                    <div className={`charts-grid ${collapsed ? '' : 'not-collapsed'}`} style={{ marginTop: '2rem' }}>    
                        <div className={`chart-card ${collapsed ? '' : 'not-collapsed'}`}>
                            <h4>Top 10 Universities students wish to apply
                                {Object.keys(stats.top10UniversityNames).length === 0 && (
                                    <p style={{color:"var(--inactive-btn-color)", fontSize: "12px"}}><i>*No data available.</i></p>
                                )}</h4>
                            <hr className="chart-description-line"/>
                            <div className="chart-wrapper">
                                <Bar data={top10UniversityNamesData} options={chartOptions} />
                            </div>
                        </div>
                        <div className={`chart-card ${collapsed ? '' : 'not-collapsed'}`}>
                            <h4>Top 10 University Countries students wish to apply
                                {Object.keys(stats.top10UniversityCountries).length === 0 && (
                                    <p style={{color:"var(--inactive-btn-color)", fontSize: "12px"}}><i>*No data available.</i></p>
                                )}
                            </h4>
                            <hr className="chart-description-line"/>
                            <div className="chart-wrapper">
                                <Bar data={top10UniversityCountriesData} options={chartOptions} />
                            </div>
                        </div>
                    </div>
                        {user.status === 'HOI' && (
                        <div className={`charts-grid ${collapsed ? '' : 'not-collapsed'}`} style={{ marginTop: '2rem' }}>
                        <div className={`chart-card ${collapsed ? '' : 'not-collapsed'}`}>
                            <h4>Number of Faculty giving LoRs Vs School</h4>
                            <hr className="chart-description-line"/>
                            <p>Upon filtering by school, the below visualization shows the count of faculty from each school whom which the students from the selected school has chosen to request LoR.</p>
                            <div className="chart-wrapper">
                                <Pie data={facultyCountBySchoolData} options={facultyPieChartOptions} />
                            </div>
                        </div>
                        </div>
                        )}
            </div>
        </DashboardLayout>
    )
}

export default ViewAnalysis;
