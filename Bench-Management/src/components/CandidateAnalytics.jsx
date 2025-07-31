// src/components/CandidateAnalyticsSection.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Form, ListGroup, Spinner, Alert, Card, Button, InputGroup } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { fetchCandidateSubtopicScores } from '../services/assessmentReportDetailsService';
import { fetchBenchDetails } from '../services/benchService';
import { 
    addMentorFeedback, 
    getFeedbacksByCandidate, 
    deleteMentorFeedback 
} from '../services/mentorService';
import './CandidateAnalytics.css';

/**
 * A self-contained component for the entire "Single Candidate Analytics" section.
 * It includes a search bar, a score comparison chart, and a fully functional mentor feedback section.
 */
const CandidateAnalyticsSection = () => {
    // State for this entire section is managed internally
    const [allEmployees, setAllEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    
    const [chartData, setChartData] = useState([]);
    const [mentorFeedbacks, setMentorFeedbacks] = useState([]);
    const [newFeedback, setNewFeedback] = useState('');

    const [loading, setLoading] = useState({ employees: true, content: false, action: false });
    const [error, setError] = useState({ employees: null, content: null, action: null });

    // --- Data Fetching ---

    useEffect(() => {
        const loadAllEmployees = async () => {
            try {
                setLoading(prev => ({ ...prev, employees: true }));
                const data = await fetchBenchDetails();
                setAllEmployees(data || []);
            } catch (err) {
                setError(prev => ({ ...prev, employees: 'Could not load employee list.' }));
            } finally {
                setLoading(prev => ({ ...prev, employees: false }));
            }
        };
        loadAllEmployees();
    }, []);

    useEffect(() => {
        if (!selectedEmployee) {
            setChartData([]);
            setMentorFeedbacks([]);
            return;
        }
        const loadContent = async () => {
            setLoading(prev => ({ ...prev, content: true }));
            setError(prev => ({ ...prev, content: null }));
            try {
                const [scores, feedbacks] = await Promise.all([
                    fetchCandidateSubtopicScores(selectedEmployee.empId),
                    getFeedbacksByCandidate(selectedEmployee.empId)
                ]);
                setChartData(scores || []);
                setMentorFeedbacks(feedbacks || []);
            } catch (err) {
                setError(prev => ({ ...prev, content: 'Could not load candidate details.' }));
            } finally {
                setLoading(prev => ({ ...prev, content: false }));
            }
        };
        loadContent();
    }, [selectedEmployee]);


    // --- Handlers ---

    const handleAddFeedback = async () => {
        if (!newFeedback.trim() || !selectedEmployee) return;
        setLoading(prev => ({ ...prev, action: true }));
        try {
            const createdFeedback = await addMentorFeedback(selectedEmployee.empId, newFeedback);
            setMentorFeedbacks(prev => [createdFeedback, ...prev]);
            setNewFeedback('');
        } catch (err) {
            setError(prev => ({ ...prev, action: 'Failed to add feedback.' }));
        } finally {
            setLoading(prev => ({ ...prev, action: false }));
        }
    };

    const handleDeleteFeedback = async (feedbackId) => {
        setLoading(prev => ({ ...prev, action: true }));
        try {
            await deleteMentorFeedback(feedbackId);
            setMentorFeedbacks(prev => prev.filter(fb => fb.mentor_feedback_id !== feedbackId));
        } catch (err) {
            setError(prev => ({ ...prev, action: 'Failed to delete feedback.' }));
        } finally {
            setLoading(prev => ({ ...prev, action: false }));
        }
    };

    // --- UI Logic ---

    const searchResults = useMemo(() => {
        if (!searchTerm) return [];
        return allEmployees.filter(emp =>
            emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.empId.toString().includes(searchTerm)
        ).slice(0, 10);
    }, [searchTerm, allEmployees]);

    return (
        // ✨ 2. USE THE NEW CSS CLASS FOR THE CARD
        <Card className="mt-4 analytics-card">
            <Card.Header>
                <h4 className="mb-0">Single Candidate Analytics</h4>
            </Card.Header>
            <Card.Body>
                {/* Search Bar Section */}
                <Row className="mb-4">
                    <Col md={6}>
                        <h6 className="mb-2">Search Candidate</h6>
                        {loading.employees ? <Spinner animation="border" size="sm" /> : 
                         error.employees ? <Alert variant="danger" size="sm">{error.employees}</Alert> : (
                            <>
                                <Form.Control
                                    type="search"
                                    placeholder="By Name or Employee ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchResults.length > 0 && (
                                    <ListGroup className="mt-2 search-results-list">
                                        {searchResults.map(emp => (
                                            <ListGroup.Item key={emp.empId} action onClick={() => { setSelectedEmployee(emp); setSearchTerm(''); }}>
                                                <strong>{emp.name}</strong> ({emp.empId})
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                            </>
                        )}
                    </Col>
                </Row>

                {/* Content Section */}
                {!selectedEmployee ? (
                    <div className="d-flex align-items-center justify-content-center" style={{minHeight: '400px'}}>
                        <p className="text-muted fs-5">Search for a candidate to view their details.</p>
                    </div>
                ) : loading.content ? (
                    <div className="text-center p-5"><Spinner animation="border" /></div>
                ) : error.content ? (
                    <Alert variant="danger">{error.content}</Alert>
                ) : (
                    <Row>
                        {/* Left Column: Chart */}
                        <Col md={7} className="pe-md-4">
                            <h6 className="chart-title text-center mb-3">Score Analysis for {selectedEmployee.name}</h6>
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }} barSize={20}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="subtopic_name" tick={{ fontSize: 12 }} />
                                        <YAxis />
                                        <Tooltip contentStyle={{ background: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ccc', borderRadius: '5px' }} />
                                        <Legend />
                                        <Bar dataKey="average_marks" name="Average Score" fill="#adb5bd" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="marks" name="Your Score" radius={[4, 4, 0, 0]}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.marks < entry.average_marks ? '#dc3545' : '#0d6efd'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="d-flex align-items-center justify-content-center h-100"><p className="text-muted">No score data found.</p></div>
                            )}
                        </Col>
                        
                        {/* Right Column: Mentor Feedback */}
                        {/* ✨ 3. APPLY NEW CSS CLASSES TO THE FEEDBACK SECTION */}
                        <Col md={5} className="border-start ps-md-4 feedback-section">
                            <h6 className="mb-3">Mentor Feedback</h6>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    placeholder="Add new feedback..."
                                    value={newFeedback}
                                    onChange={(e) => setNewFeedback(e.target.value)}
                                    disabled={loading.action}
                                />
                                <Button onClick={handleAddFeedback} disabled={loading.action || !newFeedback.trim()}>
                                    {loading.action ? <Spinner as="span" animation="border" size="sm" /> : 'Add'}
                                </Button>
                            </InputGroup>
                            {error.action && <Alert variant="danger" size="sm" className="mt-2">{error.action}</Alert>}
                            <div className="feedback-list">
                                {mentorFeedbacks.length > 0 ? (
                                    mentorFeedbacks.map(fb => (
                                        <div key={fb.mentor_feedback_id} className="feedback-item">
                                            <div className="feedback-meta">
                                                <div className="date">{new Date(fb.date).toLocaleDateString()}</div>
                                                <div className="trainer-name">by {fb.trainer_name}</div>
                                            </div>
                                            <div className="feedback-content">
                                                <p className="mb-0">{fb.mentor_feedback}</p>
                                            </div>
                                            <div className="feedback-actions">
                                                <Button 
                                                    variant="link" 
                                                    onClick={() => handleDeleteFeedback(fb.mentor_feedback_id)} 
                                                    disabled={loading.action}
                                                    title="Delete feedback"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted small mt-2">No feedback found for this candidate.</p>
                                )}
                            </div>
                        </Col>
                    </Row>
                )}
            </Card.Body>
        </Card>
    );
};

export default CandidateAnalyticsSection;