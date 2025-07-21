// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Card, Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
// import './AssessmentHome.css';
// import ExpandableCard from '../../components/ExpandableCard';
// import { fetchAllAssessments } from '../../services/assessmentService';
// import AssessmentScoreList from './AssessmentScoreList';
// import useBenchData from '../../services/useBenchData';

// function AssessmentLanding() {
//   // Use loading from useBenchData to enforce authentication
//   const { loading } = useBenchData();
//   const navigate = useNavigate();
//   const [searchText, setSearchText] = useState('');
//   const [allAssessments, setAllAssessments] = useState([]);
//   const [loadingAssessments, setLoadingAssessments] = useState(true);
//   const [searchEmpId, setSearchEmpId] = useState('');
//   const [searchEmpName, setSearchEmpName] = useState('');
//   const [selectedTopic, setSelectedTopic] = useState('');
//   const [selectedDate, setSelectedDate] = useState('');
//   const [minScore, setMinScore] = useState('');

//   const topics = ["Java", "C++", "Python", "JavaScript", "React", "Node.js", "SQL", "Databases"];

//   useEffect(() => {
//     const loadAssessments = async () => {
//       try {
//         const data = await fetchAllAssessments();
//         setAllAssessments(data);
//       } catch (error) {
//         console.error("Error loading assessments:", error);
//       } finally {
//         setLoadingAssessments(false);
//       }
//     };
//     loadAssessments();
//   }, []);

//   const filteredAssessments = allAssessments.filter(assessment => {
//     const matchesTopic = selectedTopic ? assessment.topic === selectedTopic : true;
//     const matchesSearch = searchText
//       ? assessment.assessmentLink.toLowerCase().includes(searchText.toLowerCase())
//       : true;
//     return matchesTopic && matchesSearch;
//   });

//   if (loading) {
//     return (
//       <div className="text-center py-5">
//         <span className="spinner-border text-primary" />
//       </div>
//     );
//   }

//   return (
//     <Container className="py-5" style={{ marginTop: '80px', maxWidth: '1000px' }}>
//       <h3 className="mb-4 text-center fw-semibold">Assessment Dashboard</h3>

//       {/* Unified Search + Topic Filter */}
//       <Card className="p-4 shadow-sm mb-4">
//         <h5 className="mb-3 fw-semibold">Search Assessments</h5>
//         <Form>
//           <Row className="g-3">
//             <Col md={4}>
//               <Form.Label>Employee Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Search by employee name"
//                 value={searchEmpName}
//                 onChange={(e) => setSearchEmpName(e.target.value)}
//               />
//             </Col>
//             <Col md={2}>
//               <Form.Label>Emp ID</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Emp ID"
//                 value={searchEmpId}
//                 onChange={(e) => setSearchEmpId(e.target.value)}
//               />
//             </Col>
//             <Col md={2}>
//               <Form.Label>Min Marks</Form.Label>
//               <Form.Control
//                 type="number"
//                 placeholder="e.g. 30"
//                 value={minScore}
//                 onChange={(e) => setMinScore(e.target.value)}
//               />
//             </Col>
//             <Col md={2}>
//               <Form.Label>Topic</Form.Label>
//               <Form.Select
//                 value={selectedTopic}
//                 onChange={(e) => setSelectedTopic(e.target.value)}
//               >
//                 <option value="">All</option>
//                 {topics.map((topic, idx) => (
//                   <option key={idx} value={topic}>{topic}</option>
//                 ))}
//               </Form.Select>
//             </Col>
//             <Col md={2}>
//               <Form.Label>Date</Form.Label>
//               <Form.Control
//                 type="date"
//                 value={selectedDate}
//                 onChange={(e) => setSelectedDate(e.target.value)}
//               />
//             </Col>
//           </Row>
//         </Form>

//         {/* Assessments List */}
//         <div className='mt-4'
//           style={{
//             maxHeight: '400px',
//             overflowY: 'auto',
//             paddingRight: '5px',
//           }}
//         >
//           {loadingAssessments ? (
//             <div className="text-center my-4">
//               <Spinner animation="border" variant="primary" />
//             </div>
//           ) : (
//             filteredAssessments.map((assessment) => (
//               <ExpandableCard
//                 key={assessment.assessmentId}
//                 title={assessment.topic}
//                 subtitle={`${assessment.createdDate} — ${assessment.assessmentLink}`}
//               >
//                 <AssessmentScoreList
//                   assessmentId={assessment.assessmentId}
//                   topic={assessment.topic}
//                   searchEmpId={searchEmpId}
//                   searchEmpName={searchEmpName}
//                   selectedDate={selectedDate}
//                   minScore={minScore}
//                 />
//               </ExpandableCard>
//             ))
//           )}
//         </div>
//       </Card>

//       {/* Assign New */}
//       <div className='align-items-center d-flex justify-content-center'>
//         <button
//           className="p-4 text-center clickable bg-light mt-4 animated-btn animated-btn-wide"
//           onClick={() => navigate('/assign-assessment')}
//           style={{ cursor: 'pointer', width: '100%', maxWidth: '800px' }}
//         >
//           <svg preserveAspectRatio="none" viewBox="0 0 1000 100">
//             <polyline points="1000,0 1000,100 0,100 0,0 1000,0" />
//           </svg>
//           <span className="mb-0 text-primary">+ Create & Assign New Assessment</span>
//         </button>
//       </div>
//     </Container>
//   );
// }

// export default AssessmentLanding;


import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Spinner, Alert, Badge } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTrophy, faStar } from '@fortawesome/free-solid-svg-icons';

import { fetchAssessmentByEmpId, fetchReportByMainTopic,
    fetchReportByTopic,
    fetchTopPerformerByMainTopic,
    fetchTopPerformerByTopic } from '../../services/diffAssessmentService';// Make sure this path is correct
import './AssessmentHome.css'; // Custom CSS for styling

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// --- Helper Components ---
const StatCard = ({ title, value, icon, variant }) => (
    <Card className={`shadow-sm text-center h-100 bg-${variant}-light`}>
        <Card.Body>
            <FontAwesomeIcon icon={icon} size="2x" className={`text-${variant} mb-3`} />
            <h5 className="card-title">{title}</h5>
            <p className="card-text fs-4 fw-bold">{value}</p>
        </Card.Body>
    </Card>
);

const Section = ({ title, children }) => (
    <Card className="shadow-sm mb-4">
        <Card.Header as="h4" className="bg-light">
            {title}
        </Card.Header>
        <Card.Body>
            {children}
        </Card.Body>
    </Card>
);


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
            setError(prev => ({ ...prev, employee: `Could not find assessment data for Employee ID: ${empId}` }));
        } finally {
            setLoading(prev => ({ ...prev, employee: false }));
        }
    };

    const handleFetchReport = async (type, value) => {
        if (!value) {
            setReportData([]);
            setTopPerformer('');
            return;
        }
        setLoading(prev => ({ ...prev, report: true }));
        setError(prev => ({ ...prev, report: null }));
        try {
            let report;
            let performer;
            if (type === 'main') {
                [report, performer] = await Promise.all([
                    fetchReportByMainTopic(value),
                    fetchTopPerformerByMainTopic(value)
                ]);
            } else {
                [report, performer] = await Promise.all([
                    fetchReportByTopic(value),
                    fetchTopPerformerByTopic(value)
                ]);
            }
            setReportData(report || []);
            setTopPerformer(performer || 'Not available.');
        } catch (err) {
            setError(prev => ({ ...prev, report: `Could not fetch report for ${value}.` }));
        } finally {
            setLoading(prev => ({ ...prev, report: false }));
        }
    };

    // --- Chart Data Preparation ---
    const completionChartData = {
        labels: ['Completed', 'Pending'],
        datasets: [{
            data: [employeeData?.completionStatus?.completed || 0, employeeData?.completionStatus?.pending || 0],
            backgroundColor: ['#28a745', '#ffc107'],
            borderColor: ['#ffffff', '#ffffff'],
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
            <h1 className="mb-4">Assessment Analytics Dashboard</h1>

            {/* Individual Performance Section */}
            <Section title="Individual Performance Report">
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
            <Section title="Topic-wise Performance Report">
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Filter by Main Topic</Form.Label>
                            <Form.Control as="select" value={mainTopic} onChange={e => { setMainTopic(e.target.value); setSubTopic(''); handleFetchReport('main', e.target.value); }}>
                                <option value="">Select a Main Topic...</option>
                                <option value="Java">Java</option>
                                <option value="Python">Python</option>
                                {/* Add more main topics as needed */}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Filter by Sub-Topic</Form.Label>
                            <Form.Control as="select" value={subTopic} onChange={e => { setSubTopic(e.target.value); setMainTopic(''); handleFetchReport('sub', e.target.value); }}>
                                <option value="">Select a Sub-Topic...</option>
                                <option value="OOPs">OOPs</option>
                                <option value="Multithreading">Multithreading</option>
                                <option value="Collections">Collections</option>
                                {/* Add more sub-topics as needed */}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>

                {loading.report && <div className="text-center p-4"><Spinner animation="border" variant="primary" /></div>}
                {error.report && <Alert variant="danger">{error.report}</Alert>}
                {(reportData.length > 0 || topPerformer) && (
                    <>
                        <Card className="mb-4 bg-success-light">
                            <Card.Body className="d-flex align-items-center">
                                <FontAwesomeIcon icon={faTrophy} size="2x" className="text-success me-3" />
                                <div>
                                    <h5 className="card-title mb-0">Top Performer</h5>
                                    <p className="card-text mb-0">{topPerformer}</p>
                                </div>
                            </Card.Body>
                        </Card>

                        <Table striped bordered hover responsive className="shadow-sm">
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
                )}
            </Section>
        </Container>
    );
}

export default AssessmentHome;
