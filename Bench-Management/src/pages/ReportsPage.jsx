import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Container, Row, Col, Card, Form, Table, Button, Spinner, Alert, ButtonGroup } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, PointElement, LineElement, Filler } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { getElementAtEvent } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faChartLine, faUsers, faTasks, faUserCheck, faChartPie, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import {
    fetchDailyBenchStatus,
    fetchMonthlyBenchStatus,
    fetchStatusDistribution,
    fetchAgingAnalysis
} from '../services/assessmentReportDetailsService';

import './ReportsPage.css';

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

    // States to hold the specific candidate list from each relevant API
    const [allBenchEmployees, setAllBenchEmployees] = useState([]); // Default list from Status API
    const [agingAnalysisCandidates, setAgingAnalysisCandidates] = useState([]); // List from Aging API

    // Data states for charts
    const [benchMovementData, setBenchMovementData] = useState({});
    const [statusData, setStatusData] = useState({});
    const [agingData, setAgingData] = useState({});
    const [kpiData, setKpiData] = useState({});
    const [deployabilityData, setDeployabilityData] = useState({});
    const [skillDistributionData, setSkillDistributionData] = useState({});
    const [benchExitData, setBenchExitData] = useState({});


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

            const [
                movementResponse,
                statusDistResponse,
                agingDistResponse
            ] = await Promise.all([
                benchMovementFetcher,
                fetchStatusDistribution(start, end),
                fetchAgingAnalysis(start, end)
            ]);

            const candidatesFromStatusApi = statusDistResponse?.candidates || [];
            setAllBenchEmployees(candidatesFromStatusApi);
            setDetails({ title: `Bench Employees (${dateRange.start} to ${dateRange.end})`, data: candidatesFromStatusApi });

            setAgingAnalysisCandidates(agingDistResponse?.candidates || []);

            const movementCounts = movementResponse?.counts?.dailyStatus || movementResponse?.counts?.monthlyStatus || {};
            setBenchMovementData(movementCounts);
            setStatusData(statusDistResponse?.counts?.statusDistribution || {});
            setAgingData(agingDistResponse?.counts?.agingAnalysis || {});

            const onBenchCandidates = agingDistResponse?.onBenchCandidates || [];
            const leftBenchCandidates = movementResponse?.leftBenchCandidates || [];

            const totalOnBench = agingDistResponse?.counts?.onBenchCount || 0;
            const totalAgingDays = onBenchCandidates.reduce((acc, curr) => acc + curr.agingDays, 0);
            const deployableCount = onBenchCandidates.filter(c => c.isDeployable).length;
            setKpiData({
                totalOnBench,
                avgAging: totalOnBench > 0 ? (totalAgingDays / totalOnBench).toFixed(1) : 0,
                deployablePercent: totalOnBench > 0 ? ((deployableCount / totalOnBench) * 100).toFixed(1) : 0,
                leftBenchCount: movementResponse?.counts?.leftBenchCount || 0,
            });

            setDeployabilityData({
                'Deployable': deployableCount,
                'Not Deployable': totalOnBench - deployableCount
            });

            const skills = onBenchCandidates.reduce((acc, curr) => {
                acc[curr.primarySkill] = (acc[curr.primarySkill] || 0) + 1;
                return acc;
            }, {});
            setSkillDistributionData(skills);

            const exits = leftBenchCandidates.reduce((acc, curr) => {
                acc[curr.personStatus] = (acc[curr.personStatus] || 0) + 1;
                return acc;
            }, {});
            setBenchExitData(exits);


        } catch (err) {
            console.error("Failed to fetch report data:", err);
            setError("Could not load analytics data. Please check the API connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleGenerateReport();
    }, []);

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

    const deployabilityPieData = {
        labels: Object.keys(deployabilityData),
        datasets: [{
            data: Object.values(deployabilityData),
            backgroundColor: ['#28a745', '#dc3545'],
            borderColor: '#fff',
            borderWidth: 2,
        }]
    };

    const skillDistBarData = {
        labels: Object.keys(skillDistributionData),
        datasets: [{
            label: 'Employees on Bench',
            data: Object.values(skillDistributionData),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        }]
    };

    const benchExitPieData = {
        labels: Object.keys(benchExitData),
        datasets: [{
            data: Object.values(benchExitData),
            backgroundColor: ['#ffc107', '#fd7e14', '#6f42c1', '#20c997'],
            borderColor: '#fff',
            borderWidth: 2,
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

            let minDays = 0;
            let maxDays = Infinity;
            const cleanedLabel = label.trim();

            if (cleanedLabel.startsWith('<')) {
                maxDays = parseInt(cleanedLabel.match(/\d+/)[0], 10) - 1;
            } else if (cleanedLabel.endsWith('+')) {
                minDays = parseInt(cleanedLabel.match(/\d+/)[0], 10);
            } else if (cleanedLabel.includes('-')) {
                const parts = cleanedLabel.split('-').map(part => parseInt(part.trim().match(/\d+/)[0], 10));
                if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                    minDays = parts[0];
                    maxDays = parts[1];
                }
            }

            dataForTable = agingAnalysisCandidates.filter(emp => {
                const aging = emp.agingDays;
                return aging >= minDays && (maxDays === Infinity || aging <= maxDays);
            });

        } else if (type === 'status') {
            const statusLabel = statusPieData.labels[index];
            title = `Employees with Status: ${statusLabel}`;
            dataForTable = allBenchEmployees.filter(emp => emp.personStatus === statusLabel);
        }
        setDetails({ title, data: dataForTable });
    };

    const clearFilter = () => setDetails({ title: `Bench Employees (${dateRange.start} to ${dateRange.end})`, data: allBenchEmployees });

    return (
        <Container fluid className="reports-page p-4">
            <h2 className="mb-4 fw-light">Bench Analytics Dashboard</h2>

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

            {!loading && !error && (
                <>
                    {/* KPI Cards Section */}
                    <Row className="mb-4">
                        <Col md={3}><Card className="kpi-card bg-primary text-white"><Card.Body><div className="kpi-value">{kpiData.totalOnBench}</div><div className="kpi-label">Total on Bench</div></Card.Body></Card></Col>
                        <Col md={3}><Card className="kpi-card bg-warning text-dark"><Card.Body><div className="kpi-value">{kpiData.avgAging} days</div><div className="kpi-label">Average Aging</div></Card.Body></Card></Col>
                        <Col md={3}><Card className="kpi-card bg-success text-white"><Card.Body><div className="kpi-value">{kpiData.deployablePercent}%</div><div className="kpi-label">Deployable</div></Card.Body></Card></Col>
                        <Col md={3}><Card className="kpi-card bg-danger text-white"><Card.Body><div className="kpi-value">{kpiData.leftBenchCount}</div><div className="kpi-label">Left Bench (Period)</div></Card.Body></Card></Col>
                    </Row>

                    {/* Main Content: New Grid Layout */}
                    <Row>
                        <Col xl={6} className="mb-4">
                            <Card className="shadow-sm h-100">
                                <Card.Body className="d-flex flex-column">
                                    <h5 className="card-title text-center mb-3">Bench Movement ({granularity})</h5>
                                    <div className="chart-container flex-grow-1" style={{ minHeight: '300px' }}>
                                        {granularity === 'daily'
                                            ? <Line data={movementChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                                            : <Bar data={movementChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                                        }
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={6} className="mb-4">
                            <Card className="shadow-sm h-100">
                                <Card.Body className="d-flex flex-column">
                                    <h5 className="card-title text-center mb-3"><FontAwesomeIcon icon={faChartPie} className="me-2" />Employee Status</h5>
                                    <div className="chart-container flex-grow-1">
                                        <Pie 
                                            ref={chartRefs.status} 
                                            data={statusPieData} 
                                            options={{ 
                                                responsive: true, 
                                                maintainAspectRatio: false, 
                                                plugins: { 
                                                    legend: { 
                                                        position: 'left' 
                                                    } 
                                                } 
                                            }} 
                                            onClick={(e) => handleChartClick(e, chartRefs.status, 'status')} 
                                        />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row className="align-items-start">
                        {/* Left Column: Two compact cards */}
                        <Col xl={4} className="mb-4">
                            <Card className="shadow-sm mb-3" style={{ height: '220px' }}>
                                <Card.Body className="d-flex flex-column">
                                    <p className="card-title text-center mb-3">
                                        <FontAwesomeIcon icon={faUserCheck} className="me-2" />Deployability
                                    </p>
                                    <div className="flex-grow-1">
                                        <Pie 
                                            data={deployabilityPieData} 
                                            options={{ 
                                                responsive: true, 
                                                maintainAspectRatio: false, 
                                                plugins: { 
                                                    legend: { 
                                                        position: 'left' 
                                                    } 
                                                } 
                                            }} 
                                        />
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className="shadow-sm" style={{ height: '220px' }}>
                                <Card.Body className="d-flex flex-column">
                                    <p className="card-title text-center mb-3">
                                        <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />Bench Exit Analysis
                                    </p>
                                    <div className="flex-grow-1">
                                        <Pie 
                                            data={benchExitPieData} 
                                            options={{ 
                                                responsive: true, 
                                                maintainAspectRatio: false, 
                                                plugins: { 
                                                    legend: { 
                                                        position: 'left' 
                                                    } 
                                                } 
                                            }} 
                                        />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Middle Column */}
                        <Col xl={4} className="mb-4" style={{ height: '440px' }}>
                            <Card className="shadow-sm h-100">
                                <Card.Body className="d-flex flex-column">
                                    <h5 className="card-title text-center mb-3">
                                        <FontAwesomeIcon icon={faTasks} className="me-2" />Skill Distribution on Bench
                                    </h5>
                                    <div className="flex-grow-1">
                                        <Bar
                                            data={skillDistBarData}
                                            options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y' }}
                                        />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Right Column */}
                        <Col xl={4} className="mb-4" style={{ height: '440px' }}>
                            <Card className="shadow-sm h-100">
                                <Card.Body className="d-flex flex-column">
                                    <h5 className="card-title text-center mb-3">Bench Aging Analysis</h5>
                                    <div className="flex-grow-1">
                                        <Bar
                                            ref={chartRefs.aging}
                                            data={agingBarData}
                                            options={{ responsive: true, maintainAspectRatio: false }}
                                            onClick={(e) => handleChartClick(e, chartRefs.aging, 'aging')}
                                        />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>



                    {/* Details Table Section */}
                    <Row>
                        <Col>
                            <Card className="shadow-sm">
                                <Card.Header className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0 details-title"><FontAwesomeIcon icon={faUsers} className="me-2" />{details.title}</h5>
                                    <Button variant="outline-secondary" size="sm" onClick={clearFilter}>Clear Filter</Button>
                                </Card.Header>
                                <div className="details-table-container">
                                    <Table hover className="details-table mb-0">
                                        <thead>
                                            <tr>
                                                <th>Emp ID</th><th>Name</th><th>Primary Skill</th><th>Level</th><th>Location</th><th>Aging</th><th>Deployable</th><th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {details.data && details.data.length > 0 ? details.data.map(person => (
                                                <tr key={person.empId}>
                                                    <td>{person.empId}</td>
                                                    <td>{person.name}</td>
                                                    <td>{person.primarySkill}</td>
                                                    <td>{person.level || 'N/A'}</td>
                                                    <td>{person.currentLocation || person.baseLocation}</td>
                                                    <td>{person.agingDays} days</td>
                                                    <td><span className={`deploy-badge ${person.isDeployable ? 'text-deployable' : 'text-not-deployable'}`}>{person.isDeployable ? 'Yes' : 'No'}</span></td>
                                                    <td>{person.personStatus}</td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="8" className="text-center text-muted p-4">No data available for the selected period.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
}

export default ReportsPage;