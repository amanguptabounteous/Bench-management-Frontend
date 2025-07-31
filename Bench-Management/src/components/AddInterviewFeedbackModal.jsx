// src/components/AddInterviewFeedbackModal.jsx

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Alert, Row, Col, ListGroup } from 'react-bootstrap';
import { fetchInterviewCyclebyEmpId, addInterviewCycle, addInterviewRound } from '../services/interviewService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const AddInterviewFeedbackModal = ({ show, onHide, employee, onSuccess }) => {
  // State for the modal
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interviewCycles, setInterviewCycles] = useState([]);
  const [selectedCycleId, setSelectedCycleId] = useState(null);

  // State for forms
  const [showCycleForm, setShowCycleForm] = useState(false);
  const [newCycle, setNewCycle] = useState({ client: '', title: '' });
  const [newRound, setNewRound] = useState({ date: '', panel: '', status: 'PENDING', feedback: 'POSITIVE', detailedFeedback: '', review: '', round: 1 });

  // Fetch existing interview cycles when the modal opens for an employee
  useEffect(() => {
    if (show && employee) {
      const loadCycles = async () => {
        try {
          setLoading(true);
          setError(null);
          const cycles = await fetchInterviewCyclebyEmpId(employee.empId);
          setInterviewCycles(cycles || []);
          // If there's only one cycle, pre-select it
          if (cycles && cycles.length === 1) {
            setSelectedCycleId(cycles[0].cycleId);
          }
        } catch (err) {
          setError('Failed to load interview cycles.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      loadCycles();
    } else {
      // Reset state when modal is hidden
      setInterviewCycles([]);
      setSelectedCycleId(null);
      setShowCycleForm(false);
      setNewCycle({ client: '', title: '' });
      setNewRound({ date: '', panel: '', status: 'PENDING', feedback: 'POSITIVE', detailedFeedback: '', review: '', round: 1 });
    }
  }, [show, employee]);

  // ✅ Corrected version for AddInterviewFeedbackModal.jsx
const handleAddCycle = async () => {
  if (!newCycle.client || !newCycle.title) {
    alert('Client and Title are required for a new cycle.');
    return;
  }
  try {
    // Pass empId and the newCycle object as separate arguments
    const createdCycle = await addInterviewCycle(employee.empId, newCycle);
    
    setInterviewCycles(prev => [...prev, createdCycle]);
    setSelectedCycleId(createdCycle.cycleId); 
    setShowCycleForm(false);
    setNewCycle({ client: '', title: '' });
  } catch (err) {
    alert('Failed to add new cycle.');
    console.error(err);
  }
};

  const handleAddRound = async () => {
    if (!selectedCycleId) {
      alert('Please select an interview cycle first.');
      return;
    }
    try {
      await addInterviewRound(selectedCycleId, { ...newRound, empId: employee.empId });
      alert('Feedback added successfully!');
      onSuccess(employee.empId); // Trigger refresh in parent
      onHide(); // Close modal
    } catch (err) {
      alert('Failed to add new round.');
      console.error(err);
    }
  };

  if (!employee) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Feedback for {employee.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && <div className="text-center"><Spinner animation="border" /></div>}
        {error && <Alert variant="danger">{error}</Alert>}
        
        {!loading && !error && (
          <>
            {/* --- Cycle Selection --- */}
            <h6 className="mb-2">1. Select Interview Cycle</h6>
            {interviewCycles.length > 0 ? (
              <ListGroup className="mb-3">
                {interviewCycles.map(cycle => (
                  <ListGroup.Item
                    key={cycle.cycleId}
                    action
                    active={selectedCycleId === cycle.cycleId}
                    onClick={() => setSelectedCycleId(cycle.cycleId)}
                  >
                    {cycle.client} - {cycle.title}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p className="text-muted">No existing cycles. Please add one.</p>
            )}

            {/* --- Add New Cycle Form --- */}
            {!showCycleForm ? (
              <Button variant="outline-primary" size="sm" onClick={() => setShowCycleForm(true)}>
                <FontAwesomeIcon icon={faPlus} /> Create New Cycle
              </Button>
            ) : (
              <div className="p-3 my-3 bg-light border rounded">
                <Row className="g-2 align-items-center">
                  <Col><Form.Control size="sm" type="text" placeholder="Client" value={newCycle.client} onChange={e => setNewCycle({ ...newCycle, client: e.target.value })} /></Col>
                  <Col><Form.Control size="sm" type="text" placeholder="Title" value={newCycle.title} onChange={e => setNewCycle({ ...newCycle, title: e.target.value })} /></Col>
                  <Col xs="auto"><Button size="sm" onClick={handleAddCycle}>Add</Button></Col>
                </Row>
              </div>
            )}
            <hr />

            {/* --- Add New Round Form --- */}
            <h6 className="mb-3">2. Add Interview Round Details</h6>
            <Form>
              <Row className="g-2">
                <Col md={4}><Form.Control size="sm" type="number" placeholder="Round No." value={newRound.round} onChange={e => setNewRound({ ...newRound, round: e.target.value })} /></Col>
                <Col md={8}><Form.Control size="sm" type="date" value={newRound.date} onChange={e => setNewRound({ ...newRound, date: e.target.value })} /></Col>
                <Col md={12}><Form.Control size="sm" type="text" placeholder="Panel (Interviewer)" value={newRound.panel} onChange={e => setNewRound({ ...newRound, panel: e.target.value })} /></Col>
                <Col md={6}>
                  <Form.Select size="sm" value={newRound.status} onChange={e => setNewRound({ ...newRound, status: e.target.value })}>
                    <option value="PENDING">Pending</option>
                    <option value="PASSED">Passed</option>
                    <option value="FAILED">Failed</option>
                    <option value="SUCCESS">Success</option>
                  </Form.Select>
                </Col>
                 <Col md={6}>
                  <Form.Select size="sm" value={newRound.feedback} onChange={e => setNewRound({ ...newRound, feedback: e.target.value })}>
                    <option value="POSITIVE">Positive</option>
                    <option value="NEGATIVE">Negative</option>
                  </Form.Select>
                </Col>
                <Col md={12}><Form.Control size="sm" as="textarea" rows={2} placeholder="Detailed Feedback / Review" value={newRound.detailedFeedback} onChange={e => setNewRound({ ...newRound, detailedFeedback: e.target.value })} /></Col>
              </Row>
            </Form>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleAddRound} disabled={!selectedCycleId || loading}>Submit Feedback</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddInterviewFeedbackModal;