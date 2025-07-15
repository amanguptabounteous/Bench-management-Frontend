import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Container, Row, Col, Card, Form, Table, Button } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { getElementAtEvent } from 'react-chartjs-2';
import './ReportsPage.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend);

// --- Mock Data with Date Info ---
const mockBenchEmployees = [
    { empId: 'E1024', name: 'Alice Johnson', primarySkill: 'React', level: 'L3', yearsOfExperience: 5, currentLocation: 'New York', agingDays: 15, isDeployable: true, status: 'Under Evaluation', benchStartDate: '2025-06-25', benchEndDate: null },
    { empId: 'E1025', name: 'Bob Williams', primarySkill: 'Java', level: 'L4', yearsOfExperience: 8, currentLocation: 'Chicago', agingDays: 45, isDeployable: true, status: 'Interview In progress', benchStartDate: '2025-05-29', benchEndDate: null },
    { empId: 'E1026', name: 'Charlie Brown', primarySkill: 'Python', level: 'L2', yearsOfExperience: 2, currentLocation: 'Chicago', agingDays: 5, isDeployable: false, status: 'Onboarded', benchStartDate: '2025-04-10', benchEndDate: '2025-05-15' },
    { empId: 'E1027', name: 'Diana Miller', primarySkill: 'Angular', level: 'L3', yearsOfExperience: 4, currentLocation: 'New York', agingDays: 80, isDeployable: true, status: 'Under Evaluation', benchStartDate: '2025-04-24', benchEndDate: null },
    { empId: 'E1028', name: 'Ethan Davis', primarySkill: 'DevOps', level: 'L5', yearsOfExperience: 10, currentLocation: 'Austin', agingDays: 22, isDeployable: true, status: 'Onboarded', benchStartDate: '2025-03-01', benchEndDate: '2025-04-20' },
    { empId: 'E1029', name: 'Fiona Garcia', primarySkill: 'Java', level: 'L2', yearsOfExperience: 3, currentLocation: 'San Francisco', agingDays: 12, isDeployable: false, status: 'On Bench', benchStartDate: '2025-07-01', benchEndDate: null },
    { empId: 'E1030', name: 'George Rodriguez', primarySkill: 'React', level: 'L4', yearsOfExperience: 7, currentLocation: 'Chicago', agingDays: 60, isDeployable: true, status: 'On Bench', benchStartDate: '2025-05-14', benchEndDate: null },
];
const mockSkillDemands = { 'React': 5, 'Java': 3, 'Python': 2, 'Angular': 1, 'DevOps': 2, 'UI/UX': 0 };

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
    const [dateRange, setDateRange] = useState(getInitialDateRange());
    
    const initialBenchData = useMemo(() => mockBenchEmployees.filter(emp => !emp.benchEndDate), []);
    const [details, setDetails] = useState({ title: 'All Employees Currently on Bench', data: initialBenchData });

    const chartRefs = { aging: useRef(), skill: useRef(), status: useRef() };

    const dateFilteredEmployees = useMemo(() => {
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        return mockBenchEmployees.filter(emp => {
            const benchStart = new Date(emp.benchStartDate);
            const benchEnd = emp.benchEndDate ? new Date(emp.benchEndDate) : null;
            return benchStart <= end && (!benchEnd || benchEnd >= start);
        });
    }, [dateRange]);

    // --- Chart Data Processing ---
    const agingBuckets = { '0-30 days': 0, '31-60 days': 0, '61-90 days': 0, '90+ days': 0 };
    dateFilteredEmployees.forEach(emp => {
        if (emp.agingDays <= 30) agingBuckets['0-30 days']++;
        else if (emp.agingDays <= 60) agingBuckets['31-60 days']++;
        else if (emp.agingDays <= 90) agingBuckets['61-90 days']++;
        else agingBuckets['90+ days']++;
    });
    const agingAnalysisData = { labels: Object.keys(agingBuckets), datasets: [{ label: '# of Employees', data: Object.values(agingBuckets), backgroundColor: 'rgba(255, 99, 132, 0.6)' }] };

    const skillSupply = dateFilteredEmployees.reduce((acc, emp) => { acc[emp.primarySkill] = (acc[emp.primarySkill] || 0) + 1; return acc; }, {});
    const allSkills = [...new Set([...Object.keys(skillSupply), ...Object.keys(mockSkillDemands)])];
    const skillVsDemandData = { labels: allSkills, datasets: [ { label: 'Bench Supply', data: allSkills.map(skill => skillSupply[skill] || 0), backgroundColor: 'rgba(54, 162, 235, 0.6)' }, { label: 'Open Demand', data: allSkills.map(skill => mockSkillDemands[skill] || 0), backgroundColor: 'rgba(75, 192, 192, 0.6)' } ] };
    
    const statusCounts = dateFilteredEmployees.reduce((acc, emp) => { acc[emp.status] = (acc[emp.status] || 0) + 1; return acc; }, {});
    const pieChartData = { labels: Object.keys(statusCounts), datasets: [{ data: Object.values(statusCounts), backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40'] }] };

    const monthlyBenchCount = useMemo(() => {
        const counts = {};
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        for (let i = 3; i >= 0; i--) {
            const d = new Date(); d.setMonth(d.getMonth() - i);
            const monthKey = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
            counts[monthKey] = 0;
        }
        mockBenchEmployees.forEach(emp => {
            const start = new Date(emp.benchStartDate);
            const end = emp.benchEndDate ? new Date(emp.benchEndDate) : new Date();
            for (let d = new Date(start.getTime()); d <= end; d.setMonth(d.getMonth() + 1)) {
                const monthKey = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
                if (counts[monthKey] !== undefined) counts[monthKey]++;
            }
        });
        return counts;
    }, []);
    const monthlyFrequencyData = { labels: Object.keys(monthlyBenchCount), datasets: [{ label: 'Total on Bench', data: Object.values(monthlyBenchCount), borderColor: 'rgb(153, 102, 255)', backgroundColor: 'rgba(153, 102, 255, 0.5)', fill: true }] };

    const handleChartClick = (event, chartRef, type) => {
        const element = getElementAtEvent(chartRef.current, event);
        if (!element.length) return;
        const { index } = element[0];
        let filteredData = [];
        let title = '';

        if (type === 'aging') {
            const label = agingAnalysisData.labels[index];
            title = `Employees on Bench: ${label}`;
            const [min, max] = label.replace(' days', '').replace('+', '-Infinity').split('-').map(Number);
            filteredData = dateFilteredEmployees.filter(emp => emp.agingDays >= min && (max === Infinity || emp.agingDays <= max));
        } else if (type === 'skill') {
            const skill = skillVsDemandData.labels[index];
            title = `Employees with Skill: ${skill}`;
            filteredData = dateFilteredEmployees.filter(emp => emp.primarySkill === skill);
        } else if (type === 'status') {
            const status = pieChartData.labels[index];
            title = `Employees with Status: ${status}`;
            filteredData = dateFilteredEmployees.filter(emp => emp.status === status);
        }
        setDetails({ title, data: filteredData });
    };

    const clearFilter = () => setDetails({ title: 'All Employees Currently on Bench', data: initialBenchData });

    return (
        <Container fluid className="reports-page mt-4">
            <Row>
                {/* Left Panel: Charts */}
                <Col lg={5} className="charts-panel">
                    <Card className="shadow-sm mb-4">
                        <Card.Body>
                            <Card.Title>Filters</Card.Title>
                            <Row>
                                <Col><Form.Group><Form.Label>Start Date</Form.Label><Form.Control type="date" value={dateRange.start} onChange={e => setDateRange(prev => ({...prev, start: e.target.value}))} /></Form.Group></Col>
                                <Col><Form.Group><Form.Label>End Date</Form.Label><Form.Control type="date" value={dateRange.end} onChange={e => setDateRange(prev => ({...prev, end: e.target.value}))} /></Form.Group></Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    <Card className="shadow-sm mb-4"><Card.Body className="d-flex flex-column">
                        <h5 className="card-title text-center">Bench Strength Over Time</h5>
                        <div className="chart-container"><Line data={monthlyFrequencyData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
                    </Card.Body></Card>
                    <Card className="shadow-sm mb-4"><Card.Body className="d-flex flex-column">
                        <h5 className="card-title text-center">Employee Status Distribution</h5>
                        <div className="chart-container"><Pie ref={chartRefs.status} data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} onClick={(e) => handleChartClick(e, chartRefs.status, 'status')} /></div>
                    </Card.Body></Card>
                    <Card className="shadow-sm mb-4"><Card.Body className="d-flex flex-column">
                        <h5 className="card-title text-center">Bench Aging Analysis</h5>
                        <div className="chart-container"><Bar ref={chartRefs.aging} data={agingAnalysisData} options={{ responsive: true, maintainAspectRatio: false }} onClick={(e) => handleChartClick(e, chartRefs.aging, 'aging')} /></div>
                    </Card.Body></Card>
                    <Card className="shadow-sm mb-4"><Card.Body className="d-flex flex-column">
                        <h5 className="card-title text-center">Skill Demand vs. Supply</h5>
                        <div className="chart-container"><Bar ref={chartRefs.skill} data={skillVsDemandData} options={{ responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }} onClick={(e) => handleChartClick(e, chartRefs.skill, 'skill')} /></div>
                    </Card.Body></Card>
                </Col>

                {/* Right Panel: Details Table */}
                <Col lg={7} className="details-panel">
                    <Card className="shadow-sm h-100">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <span className="details-title">{details.title} ({details.data.length} employees)</span>
                            {details.title !== 'All Employees Currently on Bench' && 
                                <Button variant="outline-secondary" size="sm" onClick={clearFilter}>Show All</Button>
                            }
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive details-table-container">
                                <Table hover className="details-table">
                                    <thead>
                                        <tr>
                                            <th>Emp ID</th><th>Name</th><th>Primary Skill</th><th>Level</th><th>Yrs of Exp</th><th>Location</th><th>Aging</th><th>Deployable</th><th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {details.data.map(person => (
                                            <tr key={person.empId}>
                                                <td>{person.empId}</td><td>{person.name}</td><td>{person.primarySkill}</td><td>{person.level}</td><td>{person.yearsOfExperience}</td><td>{person.currentLocation}</td><td>{person.agingDays} days</td><td><span className={`deploy-badge ${person.isDeployable ? 'text-deployable' : 'text-not-deployable'}`}>{person.isDeployable ? 'Yes' : 'No'}</span></td><td>{person.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default ReportsPage;
