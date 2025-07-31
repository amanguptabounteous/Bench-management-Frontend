import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Container, Row, Col, Card, Form, Table, Button, Spinner, Alert, Badge } from 'react-bootstrap';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { getElementAtEvent } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUsers, faFilter } from '@fortawesome/free-solid-svg-icons';

// Import the services that provide both counts and candidate details
import {
    fetchStatusDistributionWithDetails,
    fetchAgingAnalysisWithDetails
} from '../services/assessmentReportDetailsService'; // Ensure this path is correct

import './BenchReportsPage.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// --- Helper to get a default date range (e.g., last 3 months) ---
const getInitialDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);
    return {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0]
    };
};

// --- Main Page Component ---
function BenchReportsPage() {
    // --- State Management ---
    const [dateRange, setDateRange] = useState(getInitialDateRange());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State to cache the full API responses
    const [apiResponseCache, setApiResponseCache] = useState({
        status: null,
        aging: null,
    });

    // State for the details table
    const [tableData, setTableData] = useState({ title: 'Bench Employees Report', data: [] });

    const chartRefs = { aging: useRef(), status: useRef() };

    // --- Data Fetching ---
    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                const { start, end } = dateRange;

                // Fetch both aging and status reports in parallel
                const [agingResponse, statusResponse] = await Promise.all([
                    fetchAgingAnalysisWithDetails(start, end),
                    fetchStatusDistributionWithDetails(start, end)
                ]);

                // Cache the full responses
                setApiResponseCache({
                    aging: agingResponse,
                    status: statusResponse,
                });

                // Set the initial table view to show all candidates from the aging report
                setTableData({
                    title: `All Bench Candidates (${start} to ${end})`,
                    data: agingResponse?.candidates || []
                });

            } catch (err) {
                console.error("Failed to fetch report data:", err);
                setError("Could not load analytics data. Please check the API connection.");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [dateRange]); // Re-fetch data when the date range changes

    // --- Chart Data Preparation (Memoized for performance) ---
    const agingChartData = useMemo(() => {
        const counts = apiResponseCache.aging?.counts?.agingAnalysis || {};
        return {
            labels: Object.keys(counts),
            datasets: [{
                label: '# of Employees',
                data: Object.values(counts),
                backgroundColor: 'rgba(255, 159, 64, 0.7)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
            }]
        };
    }, [apiResponseCache.aging]);

    const statusPieData = useMemo(() => {
        const counts = apiResponseCache.status?.counts?.statusDistribution || {};
        return {
            labels: Object.keys(counts),
            datasets: [{
                data: Object.values(counts),
                backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796'],
                borderColor: '#fff',
            }]
        };
    }, [apiResponseCache.status]);

    // --- Event Handlers ---
    const handleChartClick = (event, chartRef, type) => {
        if (!chartRef.current) return;
        const element = getElementAtEvent(chartRef.current, event);
        if (!element.length) return;

        const { index } = element[0];
        let filteredData = [];
        let title = '';

        if (type === 'aging' && apiResponseCache.aging) {
            const label = agingChartData.labels[index];
            title = `Employees in Aging Category: ${label}`;
            // Filter the cached candidate list
            filteredData = (apiResponseCache.aging.candidates || []).filter(emp => emp.ageingCategory === label);
        } else if (type === 'status' && apiResponseCache.status) {
            const statusLabel = statusPieData.labels[index];
            title = `Employees with Status: ${statusLabel}`;
            // Filter the cached candidate list
            filteredData = (apiResponseCache.status.candidates || []).filter(emp => emp.personStatus === statusLabel);
        }
        
        setTableData({ title, data: filteredData });
    };

    const clearFilter = () => {
        setTableData({
            title: `All Bench Candidates (${dateRange.start} to ${dateRange.end})`,
            data: apiResponseCache.aging?.candidates || []
        });
    };

    return (
        <Container fluid className="bench-reports-page p-4">
            <h2 className="page-title">Bench Analytics Dashboard</h2>

            {/* --- KPI and Filters Section --- */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="kpi-card h-100">
                        <Card.Body>
                            <div className="kpi-title">Total on Bench</div>
                            <div className="kpi-value">{apiResponseCache.aging?.counts?.totalCandidates || 0}</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={9}>
                    <Card className="filter-card h-100">
                        <Card.Body>
                            <Form as={Row} className="align-items-end">
                                <Col md={8}>
                                    <Form.Group>
                                        <Form.Label><FontAwesomeIcon icon={faCalendarAlt} className="me-2" />Select Date Range</Form.Label>
                                        <div className="d-flex">
                                            <Form.Control type="date" value={dateRange.start} onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))} />
                                            <span className="mx-2 align-self-center">-</span>
                                            <Form.Control type="date" value={dateRange.end} onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))} />
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {loading && <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* --- Charts Section --- */}
            {!loading && !error && (
                <Row>
                    <Col lg={8} className="mb-4">
                        <Card className="chart-card">
                            <Card.Body>
                                <h5 className="chart-title">Bench Aging Analysis</h5>
                                <div className="chart-container">
                                    <Bar ref={chartRefs.aging} data={agingChartData} options={{ responsive: true, maintainAspectRatio: false }} onClick={(e) => handleChartClick(e, chartRefs.aging, 'aging')} />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={4} className="mb-4">
                        <Card className="chart-card">
                            <Card.Body>
                                <h5 className="chart-title">Employee Status Distribution</h5>
                                <div className="chart-container">
                                    <Pie ref={chartRefs.status} data={statusPieData} options={{ responsive: true, maintainAspectRatio: false }} onClick={(e) => handleChartClick(e, chartRefs.status, 'status')} />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* --- Details Table Section --- */}
            {!loading && !error && (
                <Card className="table-card">
                    <Card.Header>
                        <FontAwesomeIcon icon={faUsers} className="me-2" />
                        {tableData.title}
                        <Button variant="outline-secondary" size="sm" className="float-end" onClick={clearFilter}>
                            <FontAwesomeIcon icon={faFilter} className="me-1" /> Clear Filter
                        </Button>
                    </Card.Header>
                    <Card.Body className="p-0">
                        <div className="table-responsive">
                            <Table hover className="details-table mb-0">
                                <thead>
                                    <tr><th>Emp ID</th><th>Name</th><th>Primary Skill</th><th>Level</th><th>Aging (Days)</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    {tableData.data?.map(person => (
                                        <tr key={person.empId}>
                                            <td>{person.empId}</td>
                                            <td>{person.name}</td>
                                            <td>{person.primarySkill}</td>
                                            <td>{person.level || 'N/A'}</td>
                                            <td>{person.agingDays}</td>
                                            <td><Badge bg={person.isDeployable ? 'success' : 'secondary'} pill>{person.personStatus}</Badge></td>
                                        </tr>
                                    ))}
                                    {(!tableData.data || tableData.data.length === 0) && (
                                        <tr><td colSpan="6" className="text-center text-muted p-4">No employees match the criteria.</td></tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
}

export default BenchReportsPage;
