import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Spinner, Alert, Badge } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTrophy, faStar, faFileClipboard, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';

import {
    fetchAssessmentByEmpId,
    fetchReportByMainTopic,
    fetchReportByTopic,
    fetchTopPerformerByMainTopic,
    fetchTopPerformerByTopic,
    fetchAllMainTopics,
    fetchSubTopicsByMainTopic
} from '../../services/analyticsService';

import './AssessmentHome.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// --- Helper Components ---
const StatCard = ({ title, value, icon, variant }) => (
    <Card className={`stat-card shadow-sm text-center h-100 bg-${variant}-light`}>
        <Card.Body>
            <FontAwesomeIcon icon={icon} size="2x" className={`text-${variant} mb-3`} />
            <h5 className="card-title">{title}</h5>
            <p className="card-text fs-4 fw-bold">{value}</p>
        </Card.Body>
    </Card>
);

const Section = ({ title, icon, children }) => (
    <Card className="shadow-sm mb-4">
        <Card.Header as="h5" className="fw-normal bg-light">
            <FontAwesomeIcon icon={icon} className="me-2" /> {title}
        </Card.Header>
        <Card.Body>{children}</Card.Body>
    </Card>
);

// --- Main Component ---
function AssessmentHome() {
    // --- State Management ---
    const [loading, setLoading] = useState({});
    const [error, setError] = useState({});

    // Individual Performance State
    const [empId, setEmpId] = useState('');
    const [employeeData, setEmployeeData] = useState(null);

    // Topic-wise Report State
    const [mainTopic, setMainTopic] = useState('');
    const [subTopic, setSubTopic] = useState('');
    const [reportData, setReportData] = useState([]);
    const [topPerformer, setTopPerformer] = useState('');

    // State for dynamic topic lists
    const [mainTopicsList, setMainTopicsList] = useState([]);
    const [subTopicsList, setSubTopicsList] = useState([]);


    // --- Effects for Data Fetching ---
    useEffect(() => {
        const loadMainTopics = async () => {
            setLoading(prev => ({ ...prev, mainTopics: true }));
            try {
                const data = await fetchAllMainTopics();
                setMainTopicsList(data || []);
            } catch (err) {
                setError(prev => ({ ...prev, mainTopics: "Could not load main topics." }));
            } finally {
                setLoading(prev => ({ ...prev, mainTopics: false }));
            }
        };
        loadMainTopics();
    }, []);

    useEffect(() => {
        const loadSubTopics = async () => {
            if (!mainTopic) {
                setSubTopicsList([]);
                return;
            }
            setLoading(prev => ({ ...prev, subTopics: true }));
            setSubTopicsList([]);
            try {
                const data = await fetchSubTopicsByMainTopic(mainTopic);
                setSubTopicsList(data || []);
            } catch (err) {
                console.error(`Error fetching sub-topics for ${mainTopic}`, err);
                setSubTopicsList([]);
            } finally {
                setLoading(prev => ({ ...prev, subTopics: false }));
            }
        };
        loadSubTopics();
    }, [mainTopic]);


    // --- Data Fetching Handlers ---
    const handleFetchEmployeeData = async () => {
        if (!empId) return;
        setLoading(prev => ({ ...prev, employee: true }));
        setError(prev => ({ ...prev, employee: null }));
        setEmployeeData(null);
        try {
            const data = await fetchAssessmentByEmpId(empId);
            setEmployeeData(data);
        } catch (err) {
            setError(prev => ({ ...prev, employee: `Could not find data for Employee ID: ${empId}` }));
        } finally {
            setLoading(prev => ({ ...prev, employee: false }));
        }
    };

    const handleFetchReport = async (type, value) => {
        if (!value) return;
        setLoading(prev => ({ ...prev, report: true }));
        setError(prev => ({ ...prev, report: null }));
        setReportData([]);
        setTopPerformer('');
        try {
            const fetcher = type === 'main' ? fetchReportByMainTopic : fetchReportByTopic;
            const performerFetcher = type === 'main' ? fetchTopPerformerByMainTopic : fetchTopPerformerByTopic;

            const [report, performer] = await Promise.all([fetcher(value), performerFetcher(value)]);
            setReportData(report || []);
            setTopPerformer(performer || 'Not available.');
        } catch (err) {
            setError(prev => ({ ...prev, report: `Could not fetch report for ${value}.` }));
        } finally {
            setLoading(prev => ({ ...prev, report: false }));
        }
    };
    
    const handleClearReportFilters = () => {
        setMainTopic('');
        setSubTopic('');
        setReportData([]);
        setTopPerformer('');
        setError(prev => ({ ...prev, report: null }));
    };


    // --- Chart Data Preparation ---
    const completionChartData = {
        labels: ['Completed', 'Pending'],
        datasets: [{
            data: [employeeData?.completionStatus?.completed || 0, employeeData?.completionStatus?.pending || 0],
            backgroundColor: ['#28a745', '#ffc107'],
            borderColor: '#ffffff',
            borderWidth: 2,
        }],
    };

    const scoresChartData = {
        labels: employeeData?.perTopicScores?.map(s => s.topic) || [],
        datasets: [{
            label: 'Score (%)',
            data: employeeData?.perTopicScores?.map(s => Math.round((s.empScore / s.totalScore) * 100)) || [],
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        }],
    };

    return (
        <Container fluid className="assessment-home-page p-4">
            <div className="dashboard-header mb-4">
                <FontAwesomeIcon icon={faFileClipboard} size="2x" className="text-primary" />
                <div>
                    <h1 className="mb-0">Assessment Analytics</h1>
                    <p className="text-muted mb-0">Analyze individual and topic-wise performance.</p>
                </div>
            </div>

            {/* Individual Performance Section */}
            <Section title="Individual Performance Report" icon={faStar}>
                <Form.Group as={Row} className="mb-3 align-items-center">
                    <Form.Label column sm={2}>Employee ID:</Form.Label>
                    <Col sm={8}>
                        <Form.Control
                            type="text"
                            placeholder="Enter Employee ID (e.g., 101)"
                            value={empId}
                            onChange={(e) => setEmpId(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleFetchEmployeeData()}
                        />
                    </Col>
                    <Col sm={2}>
                        <Button onClick={handleFetchEmployeeData} className="w-100" disabled={loading.employee}>
                            {loading.employee ? <Spinner as="span" animation="border" size="sm" /> : <><FontAwesomeIcon icon={faSearch} /> Search</>}
                        </Button>
                    </Col>
                </Form.Group>

                {loading.employee && <div className="text-center p-4"><Spinner animation="border" variant="primary" /></div>}
                {error.employee && <Alert variant="danger">{error.employee}</Alert>}
                {employeeData && (
                    <Row className="mt-4 g-4">
                        <Col md={4}>
                            <Row className="g-4">
                                <Col xs={12}>
                                    <StatCard title="Overall Average" value={`${employeeData.averagePercentage || 0}%`} icon={faStar} variant="primary" />
                                </Col>
                                <Col xs={12}>
                                    <Card className="shadow-sm text-center h-100">
                                        <Card.Body>
                                            <h5 className="card-title">Completion Status</h5>
                                            <div style={{ height: '200px' }}>
                                                <Doughnut data={completionChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                                            </div>
                                            <div className="mt-3">
                                                <strong>Pending Topics:</strong>
                                                {employeeData.completionStatus.pendingTopics.length > 0 ? (
                                                    <ul className="list-unstyled mt-2">
                                                        {employeeData.completionStatus.pendingTopics.map(topic => <li key={topic}><Badge bg="warning" text="dark">{topic}</Badge></li>)}
                                                    </ul>
                                                ) : <p className="text-muted">None</p>}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={8}>
                            <Card className="shadow-sm h-100">
                                <Card.Body>
                                    <h5 className="card-title">Scores per Topic</h5>
                                    <div style={{ height: '400px' }}>
                                        <Bar data={scoresChartData} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y' }} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Section>

            {/* Topic-wise Performance Section */}
            <Section title="Topic-wise Performance Report" icon={faTrophy}>
                <Row>
                    {/* Filters Column */}
                    <Col lg={4} className="mb-4 mb-lg-0">
                        <Card>
                            <Card.Body>
                                <h6 className="card-title">Report Filters</h6>
                                <Form.Group className="mb-3">
                                    <Form.Label>Main Topic</Form.Label>
                                    <Form.Select value={mainTopic} onChange={e => {
                                        const value = e.target.value;
                                        setMainTopic(value);
                                        setSubTopic('');
                                        if (value) handleFetchReport('main', value);
                                    }} disabled={loading.mainTopics}>
                                        <option value="">{loading.mainTopics ? "Loading..." : "Select Main Topic"}</option>
                                        {mainTopicsList.map((topicName, index) => (
                                            <option key={`${topicName}-${index}`} value={topicName}>
                                                {topicName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Sub-Topic</Form.Label>
                                    <Form.Select value={subTopic} onChange={e => {
                                        const value = e.target.value;
                                        setSubTopic(value);
                                        setMainTopic('');
                                        if (value) handleFetchReport('sub', value);
                                    }} disabled={!mainTopic || loading.subTopics}>
                                        <option value="">{loading.subTopics ? "Loading..." : "Select Sub-Topic"}</option>
                                        {subTopicsList.map((topicName, index) => (
                                            <option key={`${topicName}-${index}`} value={topicName}>
                                                {topicName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Button variant="outline-secondary" size="sm" onClick={handleClearReportFilters}>
                                    <FontAwesomeIcon icon={faFilterCircleXmark} className="me-2" />Clear Filter
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    {/* Results Column */}
                    <Col lg={8}>
                        {loading.report && <div className="text-center p-5"><Spinner animation="border" /></div>}
                        {error.report && <Alert variant="danger">{error.report}</Alert>}
                        
                        {!loading.report && !error.report && (
                            reportData.length > 0 ? (
                                <>
                                    {topPerformer && (
                                        <Card className="mb-4 bg-success-light">
                                            <Card.Body className="d-flex align-items-center">
                                                <FontAwesomeIcon icon={faTrophy} size="2x" className="text-success me-3" />
                                                <div>
                                                    <h6 className="card-title mb-0">Top Performer</h6>
                                                    <p className="card-text mb-0">{topPerformer}</p>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    )}
                                    <Table striped bordered hover responsive size="sm">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Employee ID</th>
                                                <th>Employee Name</th>
                                                <th>Average Score</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reportData.map((item, index) => (
                                                <tr key={item.empId}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.empId}</td>
                                                    <td>{item.empName} {item.isTopPerformer && <FontAwesomeIcon icon={faStar} className="text-warning ms-2" />}</td>
                                                    <td>{item.averagePercentage}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </>
                            ) : (
                                <div className="text-center text-muted p-5 empty-state">
                                    <p>Select a topic to view the performance report.</p>
                                </div>
                            )
                        )}
                    </Col>
                </Row>
            </Section>
        </Container>
    );
}

export default AssessmentHome;