import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import './AssessmentHome.css';
import ExpandableCard from '../../components/ExpandableCard';
import { fetchAllAssessments } from '../../services/assessmentService';
import AssessmentScoreList from './AssessmentScoreList';
import useBenchData from '../../services/useBenchData';

function AssessmentLanding() {
  // Use loading from useBenchData to enforce authentication
  const { loading } = useBenchData();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [allAssessments, setAllAssessments] = useState([]);
  const [loadingAssessments, setLoadingAssessments] = useState(true);
  const [searchEmpId, setSearchEmpId] = useState('');
  const [searchEmpName, setSearchEmpName] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [minScore, setMinScore] = useState('');

  const topics = ["Java", "C++", "Python", "JavaScript", "React", "Node.js", "SQL", "Databases"];

  useEffect(() => {
    const loadAssessments = async () => {
      try {
        const data = await fetchAllAssessments();
        setAllAssessments(data);
      } catch (error) {
        console.error("Error loading assessments:", error);
      } finally {
        setLoadingAssessments(false);
      }
    };
    loadAssessments();
  }, []);

  const filteredAssessments = allAssessments.filter(assessment => {
    const matchesTopic = selectedTopic ? assessment.topic === selectedTopic : true;
    const matchesSearch = searchText
      ? assessment.assessmentLink.toLowerCase().includes(searchText.toLowerCase())
      : true;
    return matchesTopic && matchesSearch;
  });

  if (loading) {
    return (
      <div className="text-center py-5">
        <span className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <Container className="py-5" style={{ marginTop: '80px', maxWidth: '1000px' }}>
      <h3 className="mb-4 text-center fw-semibold">Assessment Dashboard</h3>

      {/* Unified Search + Topic Filter */}
      <Card className="p-4 shadow-sm mb-4">
        <h5 className="mb-3 fw-semibold">Search Assessments</h5>
        <Form>
          <Row className="g-3">
            <Col md={4}>
              <Form.Label>Employee Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by employee name"
                value={searchEmpName}
                onChange={(e) => setSearchEmpName(e.target.value)}
              />
            </Col>
            <Col md={2}>
              <Form.Label>Emp ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Emp ID"
                value={searchEmpId}
                onChange={(e) => setSearchEmpId(e.target.value)}
              />
            </Col>
            <Col md={2}>
              <Form.Label>Min Marks</Form.Label>
              <Form.Control
                type="number"
                placeholder="e.g. 30"
                value={minScore}
                onChange={(e) => setMinScore(e.target.value)}
              />
            </Col>
            <Col md={2}>
              <Form.Label>Topic</Form.Label>
              <Form.Select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              >
                <option value="">All</option>
                {topics.map((topic, idx) => (
                  <option key={idx} value={topic}>{topic}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </Col>
          </Row>
        </Form>

        {/* Assessments List */}
        <div className='mt-4'
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
            paddingRight: '5px',
          }}
        >
          {loadingAssessments ? (
            <div className="text-center my-4">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            filteredAssessments.map((assessment) => (
              <ExpandableCard
                key={assessment.assessmentId}
                title={assessment.topic}
                subtitle={`${assessment.createdDate} — ${assessment.assessmentLink}`}
              >
                <AssessmentScoreList
                  assessmentId={assessment.assessmentId}
                  topic={assessment.topic}
                  searchEmpId={searchEmpId}
                  searchEmpName={searchEmpName}
                  selectedDate={selectedDate}
                  minScore={minScore}
                />
              </ExpandableCard>
            ))
          )}
        </div>
      </Card>

      {/* Assign New */}
      <div className='align-items-center d-flex justify-content-center'>
        <button
          className="p-4 text-center clickable bg-light mt-4 animated-btn animated-btn-wide"
          onClick={() => navigate('/assign-assessment')}
          style={{ cursor: 'pointer', width: '100%', maxWidth: '800px' }}
        >
          <svg preserveAspectRatio="none" viewBox="0 0 1000 100">
            <polyline points="1000,0 1000,100 0,100 0,0 1000,0" />
          </svg>
          <span className="mb-0 text-primary">+ Create & Assign New Assessment</span>
        </button>
      </div>
    </Container>
  );
}

export default AssessmentLanding;