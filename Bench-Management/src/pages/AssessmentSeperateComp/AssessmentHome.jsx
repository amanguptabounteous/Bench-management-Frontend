import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Container, Row, Col, Card, Form, Table, Spinner, Alert, Badge, Nav, Tab } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getElementAtEvent } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faStar, faExclamationTriangle, faChartBar } from '@fortawesome/free-solid-svg-icons';

import {
    fetchSkillProficiency,
    fetchSubTopicProficiency,
    fetchNeedsSupport,
    fetchEmployeesWithDetails
} from '../../services/assessmentReportDetailsService';
import {
    fetchAllMainTopics,
    fetchReportByMainTopic,
    fetchSubTopicsByMainTopic,
    fetchReportByTopic
} from '../../services/analyticsService';
import CandidateAnalyticsSection from '../../components/CandidateAnalytics';

import './AssessmentHome.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- Chart Options for Minimalist Design ---
const commonChartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false, // Hide legend
        },
        tooltip: {
            backgroundColor: '#212529',
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 12 },
            padding: 10,
            cornerRadius: 4,
            displayColors: false,
        },
    },
    scales: {
        x: {
            grid: {
                display: false, // Hide x-axis grid lines
            },
            ticks: {
                font: { size: 10 }
            }
        },
        y: {
            grid: {
                display: false, // Hide y-axis grid lines
            },
            ticks: {
                font: { size: 11 }
            }
        }
    }
};


// --- Main Component ---
function AssessmentHome() {
    // --- State Management ---
    const [activeTab, setActiveTab] = useState('leaderboard');
    const [loading, setLoading] = useState({});
    const [error, setError] = useState({});
    const [mainTopics, setMainTopics] = useState([]);
    
    // State for Leaderboard tab
    const [selectedSkill, setSelectedSkill] = useState('');
    const [selectedSubTopic, setSelectedSubTopic] = useState('');
    const [subTopicsList, setSubTopicsList] = useState([]);
    const [leaderboardData, setLeaderboardData] = useState([]);

    // State for Skill Gaps tab
    const [skillProficiencyData, setSkillProficiencyData] = useState([]);
    const [skillForSubtopics, setSkillForSubtopics] = useState(''); 
    const [subTopicChartData, setSubTopicChartData] = useState([]);

    // State for Needs Support tab
    const [needsSupportData, setNeedsSupportData] = useState([]);

    const proficiencyChartRef = useRef();

    // --- Initial Data Load ---
    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(prev => ({ ...prev, initial: true }));
            try {
                const [topics, proficiencyReports] = await Promise.all([
                    fetchAllMainTopics(),
                    fetchSkillProficiency()
                ]);
                setMainTopics(topics || []);
                setSkillProficiencyData(proficiencyReports || []);
                
                if (topics && topics.length > 0) {
                    setSelectedSkill(topics[0]);
                    setSkillForSubtopics(topics[0]);
                }
            } catch (err) {
                setError(prev => ({ ...prev, initial: "Could not load initial dashboard data." }));
            } finally {
                setLoading(prev => ({ ...prev, initial: false }));
            }
        };
        loadInitialData();
    }, []);

    // --- Data Fetching for Leaderboard ---
    useEffect(() => {
        if (!selectedSkill) return;
        const loadSubTopics = async () => {
            setLoading(prev => ({ ...prev, subTopicList: true }));
            try {
                const data = await fetchSubTopicsByMainTopic(selectedSkill);
                setSubTopicsList(data || []);
            } catch (err) { console.error(err); setSubTopicsList([]); } 
            finally { setLoading(prev => ({ ...prev, subTopicList: false })); }
        };
        loadSubTopics();
        setSelectedSubTopic('');
    }, [selectedSkill]);

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            setLoading(prev => ({ ...prev, leaderboard: true }));
            try {
                let report;
                if (selectedSubTopic) {
                    report = await fetchReportByTopic(selectedSubTopic);
                } else if (selectedSkill) {
                    report = await fetchReportByMainTopic(selectedSkill);
                }
                const sortedReport = (report || []).sort((a, b) => b.averagePercentage - a.averagePercentage);
                setLeaderboardData(sortedReport);
            } catch (err) {
                setError(prev => ({ ...prev, leaderboard: `Could not load leaderboard data.` }));
            } finally {
                setLoading(prev => ({ ...prev, leaderboard: false }));
            }
        };
        if (activeTab === 'leaderboard' && selectedSkill) {
            fetchLeaderboardData();
        }
    }, [selectedSkill, selectedSubTopic, activeTab]);


    // --- Data Fetching for Skill Gaps Sub-Topics ---
    useEffect(() => {
        if (!skillForSubtopics || activeTab !== 'skillGaps') return;
        const loadSubTopicChart = async () => {
            setLoading(prev => ({ ...prev, subtopics: true }));
            try {
                const data = await fetchSubTopicProficiency(skillForSubtopics);
                setSubTopicChartData(data || []);
            } catch (err) {
                setError(prev => ({ ...prev, subtopics: `Could not load sub-topics for ${skillForSubtopics}` }));
            } finally {
                setLoading(prev => ({ ...prev, subtopics: false }));
            }
        };
        loadSubTopicChart();
    }, [skillForSubtopics, activeTab]);

    // --- Fetch "Needs Support" data when tab is active ---
    useEffect(() => {
        if (activeTab === 'needsSupport') {
            const fetchSupportData = async () => {
                setLoading(prev => ({ ...prev, support: true }));
                try {
                    const data = await fetchNeedsSupport();
                    setNeedsSupportData(data || []);
                } catch (err) {
                    setError(prev => ({ ...prev, support: "Could not load 'Needs Support' data." }));
                } finally {
                    setLoading(prev => ({ ...prev, support: false }));
                }
            };
            fetchSupportData();
        }
    }, [activeTab]);


    // --- Chart Data Preparation ---
    const proficiencyChartData = useMemo(() => ({
        labels: skillProficiencyData.map(s => s.skill),
        datasets: [{ label: 'Average Score', data: skillProficiencyData.map(s => s.averageScore), backgroundColor: '#a5b4fc' }],
    }), [skillProficiencyData]);

    const subTopicDisplayChartData = useMemo(() => ({
        labels: subTopicChartData.map(s => s.subTopic),
        datasets: [{ label: 'Average Score', data: subTopicChartData.map(s => s.averageScore), backgroundColor: '#7dd3fc' }],
    }), [subTopicChartData]);

    // ✨ FIX: Corrected chart click handler
    const handleProficiencyChartClick = (event) => {
        if (!proficiencyChartRef.current) return;
        const element = getElementAtEvent(proficiencyChartRef.current, event);
        
        if (element.length > 0) {
            const skillIndex = element[0].index;
            const skillName = proficiencyChartData.labels[skillIndex];
            setSkillForSubtopics(skillName);
            setActiveTab('skillGaps');
        }
    };

    return (
        <Container fluid className="assessment-home-page p-3 p-md-4">
            <h2 className="page-title">Competency & Training Dashboard</h2>
            <Card className="report-card">
                <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                    <Card.Header className="p-0">
                        <Nav variant="tabs" className="report-tabs">
                            <Nav.Item><Nav.Link eventKey="leaderboard"><FontAwesomeIcon icon={faTrophy} className="me-2" />Leaderboard</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="skillGaps"><FontAwesomeIcon icon={faChartBar} className="me-2" />Skill Gaps</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="needsSupport"><FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />Needs Support</Nav.Link></Nav.Item>
                        </Nav>
                    </Card.Header>
                    <Card.Body className="p-2 p-md-3">
                        <Tab.Content>
                            <Tab.Pane eventKey="leaderboard">
                                <Form.Group as={Row} className="mb-3 align-items-center gx-2 filter-row">
                                    <Form.Label column sm="auto">Main Skill:</Form.Label>
                                    <Col sm={3}>
                                        <Form.Select size="sm" value={selectedSkill} onChange={e => setSelectedSkill(e.target.value)}>
                                            {mainTopics.map(topic => <option key={topic} value={topic}>{topic}</option>)}
                                        </Form.Select>
                                    </Col>
                                    <Form.Label column sm="auto">Sub-Topic:</Form.Label>
                                    <Col sm={3}>
                                        <Form.Select size="sm" value={selectedSubTopic} onChange={e => setSelectedSubTopic(e.target.value)} disabled={loading.subTopicList || subTopicsList.length === 0}>
                                            <option value="">All Sub-Topics</option>
                                            {subTopicsList.map(topic => <option key={topic} value={topic}>{topic}</option>)}
                                        </Form.Select>
                                    </Col>
                                </Form.Group>
                                {loading.leaderboard ? <div className="text-center p-5"><Spinner animation="border" size="sm" /></div> :
                                <div className="table-responsive">
                                    <Table hover className="report-table">
                                        <thead><tr><th>Rank</th><th>Employee</th><th>Avg. Score</th></tr></thead>
                                        <tbody>
                                            {leaderboardData.map((p, index) => <tr key={p.empId}><td><Badge pill bg="light" text="dark">{index + 1}</Badge></td><td>{p.empName} {p.isTopPerformer && <FontAwesomeIcon icon={faStar} className="text-warning ms-1" />}</td><td className="fw-bold">{p.averagePercentage.toFixed(1)}%</td></tr>)}
                                        </tbody>
                                    </Table>
                                </div>}
                            </Tab.Pane>

                            <Tab.Pane eventKey="skillGaps">
                                <Row>
                                    <Col md={6}>
                                        <h6 className="chart-title">Overall Skill Proficiency</h6>
                                        <div className="chart-container">
                                            <Bar ref={proficiencyChartRef} data={proficiencyChartData} options={commonChartOptions} onClick={handleProficiencyChartClick} />
                                        </div>
                                        <p className="text-center text-muted small mt-2">Click a bar to see sub-topic details</p>
                                    </Col>
                                    <Col md={6}>
                                        <h6 className="chart-title">Sub-Topic Deep Dive for <span className="fw-bold text-primary">{skillForSubtopics}</span></h6>
                                        {loading.subtopics ? <div className="text-center p-5"><Spinner animation="border" size="sm" /></div> :
                                        <div className="chart-container">
                                            <Bar data={subTopicDisplayChartData} options={commonChartOptions} />
                                        </div>}
                                    </Col>
                                </Row>
                            </Tab.Pane>
                            
                            <Tab.Pane eventKey="needsSupport">
                                <h6 className="mb-3">Employees Flagged for Support</h6>
                                {loading.support ? <div className="text-center p-5"><Spinner animation="border" size="sm" /></div> :
                                <div className="table-responsive">
                                    <Table hover className="report-table">
                                        <thead><tr><th>Employee</th><th>Primary Skill</th><th>Avg. Score</th><th>Overdue</th><th>Reason</th></tr></thead>
                                        <tbody>
                                            {needsSupportData.map(p => <tr key={p.empId}><td>{p.name}</td><td>{p.primarySkill}</td><td><Badge bg={p.averageScore < 60 ? 'danger-subtle' : 'warning-subtle'} text={p.averageScore < 60 ? 'danger-emphasis' : 'warning-emphasis'}>{p.averageScore.toFixed(1)}%</Badge></td><td>{p.overdueAssessments}</td><td><Badge bg="danger-subtle" text="danger-emphasis" pill>{p.flagReason}</Badge></td></tr>)}
                                            {needsSupportData.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-4">No data available. This requires a dedicated backend API.</td></tr>}
                                        </tbody>
                                    </Table>
                                </div>}
                            </Tab.Pane>
                        </Tab.Content>
                    </Card.Body>
                </Tab.Container>
            </Card>
            <CandidateAnalyticsSection />
        </Container>
    );
}

export default AssessmentHome;
