import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Container, Row, Col, Card, Form, Table, Button, Spinner, Alert, ButtonGroup } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, PointElement, LineElement, Filler } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { getElementAtEvent } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faChartLine, faUsers } from '@fortawesome/free-solid-svg-icons';

import { fetchBenchDetails } from '../services/benchService';
import {
    fetchDailyBenchStatus,
    fetchMonthlyBenchStatus,
    fetchStatusDistribution,
    fetchAgingAnalysis
} from '../services/analyticsService';

import './ReportsPage.css'; 

// 
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, PointElement, LineElement, Filler);

// --- Helper to get default date range (last 3 months) ---
const getInitialDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);
    return {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0]
    };
};

function ReportsPage() {
    // --- State Management ---
    const [dateRange, setDateRange] = useState(getInitialDateRange());
    const [granularity, setGranularity] = useState('monthly');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ✨ MODIFIED: State to hold the complete, unfiltered list of all employees
    const [allBenchEmployees, setAllBenchEmployees] = useState([]);
    // State for employees filtered by the selected date range
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    
    // Data states for charts
    const [benchMovementData, setBenchMovementData] = useState({});
    const [statusData, setStatusData] = useState({});
    const [agingData, setAgingData] = useState({});

    // Details table state
    const [details, setDetails] = useState({ title: 'Bench Employees Report', data: [] });

    const chartRefs = { aging: useRef(), status: useRef() };

    // --- Data Fetching ---
    const handleGenerateReport = async () => {
        setLoading(true);
        setError(null);
        try {
            const { start, end } = dateRange;

            const benchMovementFetcher = granularity === 'daily'
                ? fetchDailyBenchStatus(start, end)
                : fetchMonthlyBenchStatus(start, end);

            // ✨ MODIFIED: Using fetchBenchDetails to get complete employee data
            const [
                allEmployeesData, // This now gets ALL fields
                movementData,
                statusDist,
                agingDist
            ] = await Promise.all([
                fetchBenchDetails(), // Swapped to the correct service
                benchMovementFetcher,
                fetchStatusDistribution(start, end),
                fetchAgingAnalysis(start, end)
            ]);

            setAllBenchEmployees(allEmployeesData || []);
            setBenchMovementData(movementData || {});
            setStatusData(statusDist || {});
            setAgingData(agingDist || {});

        } catch (err) {
            console.error("Failed to fetch report data:", err);
            setError("Could not load analytics data. Please check the API connection and try again.");
        } finally {
            setLoading(false);
        }
    };
    
    // Initial data load on component mount
    useEffect(() => {
        handleGenerateReport();
    }, []);

    // ✨ NEW: This effect now handles all frontend filtering whenever the master list or date range changes.
    useEffect(() => {
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);

        const employeesInDateRange = allBenchEmployees.filter(emp => {
            const benchStart = new Date(emp.benchStartDate);
            // Handle cases where benchEndDate is null (currently on bench)
            const benchEnd = emp.benchEndDate ? new Date(emp.benchEndDate) : new Date(); // Treat null as ongoing
            return benchStart <= end && benchEnd >= start;
        });

        setFilteredEmployees(employeesInDateRange);
        setDetails({ title: `Bench Employees (${dateRange.start} to ${dateRange.end})`, data: employeesInDateRange });

    }, [dateRange, allBenchEmployees]); // This re-runs only when the date or the master employee list changes

    // --- Chart Data Preparation ---
    const movementChartData = useMemo(() => {
        const labels = Object.keys(benchMovementData);
        return {
            labels,
            datasets: [
                {
                    label: 'On Bench',
                    data: labels.map(label => benchMovementData[label]?.onBench || 0),
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    fill: true,
                    tension: 0.3
                },
                {
                    label: 'Left Bench',
                    data: labels.map(label => benchMovementData[label]?.leftBench || 0),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    fill: true,
                    tension: 0.3
                }
            ]
        };
    }, [benchMovementData]);

    const statusPieData = {
        labels: Object.keys(statusData),
        datasets: [{
            data: Object.values(statusData),
            backgroundColor: ['#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40', '#ff6384'],
            borderColor: '#fff',
            borderWidth: 2,
        }]
    };

    const agingBarData = {
        labels: Object.keys(agingData),
        datasets: [{
            label: '# of Employees',
            data: Object.values(agingData),
            backgroundColor: 'rgba(255, 159, 64, 0.6)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1,
        }]
    };

    // --- Event Handlers ---
    const handleChartClick = (event, chartRef, type) => {
        const element = getElementAtEvent(chartRef.current, event);
        if (!element.length) return;
        const { index } = element[0];
        let dataForTable = [];
        let title = '';

        if (type === 'aging') {
            const label = agingBarData.labels[index];
            title = `Employees on Bench: ${label}`;
            const [min, maxStr] = label.replace(' days', '').replace('+', '-Infinity').split('-');
            const minDays = Number(min);
            const maxDays = Number(maxStr);
            dataForTable = filteredEmployees.filter(emp => emp.agingDays >= minDays && (maxDays === Infinity || emp.agingDays <= maxDays));
        } else if (type === 'status') {
            const statusLabel = statusPieData.labels[index];
            title = `Employees with Status: ${statusLabel}`;
            dataForTable = filteredEmployees.filter(emp => emp.personStatus === statusLabel);
        }
        setDetails({ title, data: dataForTable });
    };

    const clearFilter = () => setDetails({ title: `Bench Employees (${dateRange.start} to ${dateRange.end})`, data: filteredEmployees });

    return (
        <Container fluid className="reports-page p-4">
            <h2 className="mb-4 fw-light">Bench Analytics Dashboard</h2>

            {/* Controls Section */}
            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <Row className="align-items-end g-3">
                        <Col md={5}>
                            <Form.Group>
                                <Form.Label><FontAwesomeIcon icon={faCalendarAlt} className="me-2" />Date Range</Form.Label>
                                <Row>
                                    <Col><Form.Control type="date" value={dateRange.start} onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))} /></Col>
                                    <Col><Form.Control type="date" value={dateRange.end} onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))} /></Col>
                                </Row>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label><FontAwesomeIcon icon={faChartLine} className="me-2" />Time Granularity</Form.Label>
                                <ButtonGroup className="w-100">
                                    <Button variant={granularity === 'daily' ? 'primary' : 'outline-primary'} onClick={() => setGranularity('daily')}>Daily</Button>
                                    <Button variant={granularity === 'monthly' ? 'primary' : 'outline-primary'} onClick={() => setGranularity('monthly')}>Monthly</Button>
                                </ButtonGroup>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Button className="w-100" onClick={handleGenerateReport} disabled={loading}>
                                {loading ? <Spinner as="span" animation="border" size="sm" /> : "Generate Report"}
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            
            {loading && <div className="text-center p-5"><Spinner animation="border" variant="primary" /><span className="ms-2">Generating reports...</span></div>}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Charts Section */}
            {!loading && !error && (
                <>
                    <Row>
                        <Col xl={8} className="mb-4">
                            <Card className="shadow-sm h-100">
                                <Card.Body className="d-flex flex-column">
                                    <h5 className="card-title text-center mb-3">Bench Movement ({granularity})</h5>
                                    <div className="chart-container flex-grow-1">
                                        {granularity === 'daily' 
                                            ? <Line data={movementChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                                            : <Bar data={movementChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                                        }
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={4} className="mb-4">
                            <Card className="shadow-sm h-100">
                                <Card.Body className="d-flex flex-column">
                                    <h5 className="card-title text-center mb-3">Employee Status Distribution</h5>
                                    <div className="chart-container flex-grow-1">
                                        <Pie ref={chartRefs.status} data={statusPieData} options={{ responsive: true, maintainAspectRatio: false }} onClick={(e) => handleChartClick(e, chartRefs.status, 'status')} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={12} className="mb-4">
                            <Card className="shadow-sm h-100">
                                <Card.Body className="d-flex flex-column">
                                    <h5 className="card-title text-center mb-3">Bench Aging Analysis</h5>
                                    <div className="chart-container flex-grow-1" style={{minHeight: '300px'}}>
                                        <Bar ref={chartRefs.aging} data={agingBarData} options={{ responsive: true, maintainAspectRatio: false }} onClick={(e) => handleChartClick(e, chartRefs.aging, 'aging')} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Details Table Section */}
                    <Row>
                        <Col>
                            <Card className="shadow-sm">
                                <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                                    <h5 className="mb-0"><FontAwesomeIcon icon={faUsers} className="me-2" />{details.title}</h5>
                                    <Button variant="outline-secondary" size="sm" onClick={clearFilter}>Clear Filter</Button>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <div className="table-responsive">
                                        <Table hover className="details-table mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Emp ID</th><th>Name</th><th>Primary Skill</th><th>Level</th><th>YoE</th><th>Location</th><th>Aging</th><th>Deployable</th><th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {details.data.map(person => (
                                                    <tr key={person.empId}>
                                                        <td>{person.empId}</td>
                                                        <td>{person.name}</td>
                                                        <td>{person.primarySkill}</td>
                                                        <td>{person.level || 'N/A'}</td>
                                                        <td>{person.experience}</td>
                                                        <td>{person.currentLocation}</td>
                                                        <td>{person.agingDays} days</td>
                                                        <td><span className={`badge bg-${person.isDeployable ? 'success' : 'danger'}`}>{person.isDeployable ? 'Yes' : 'No'}</span></td>
                                                        <td>{person.personStatus}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
}

export default ReportsPage;
