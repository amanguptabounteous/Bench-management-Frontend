import React, { useState } from 'react';
import { Card, Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';

const allEmployees = [
  { id: 101, name: 'Alice Sharma' },
  { id: 102, name: 'Ravi Mehra' },
  { id: 103, name: 'Tanvi Raj' },
  { id: 104, name: 'Deepak Jha' },
  { id: 105, name: 'Nikita Das' },
];

function AssignAssessment() {
  const [step, setStep] = useState(1);
  const [link, setLink] = useState('');
  const [topic, setTopic] = useState('');
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [totalMarks, setTotalMarks] = useState('');

  const handleCreateAssessment = () => {
    const newAssessment = {
      id: assessments.length + 1,
      link,
      topic,
      date: new Date().toISOString().split('T')[0],
    };
    setAssessments([...assessments, newAssessment]);
    setSelectedAssessment(newAssessment.id);
    setStep(2);
  };

  const handleToggleEmployee = (emp) => {
    if (selectedEmployees.includes(emp.id)) {
      setSelectedEmployees(selectedEmployees.filter(eid => eid !== emp.id));
    } else {
      setSelectedEmployees([...selectedEmployees, emp.id]);
    }
  };

  const handleAssign = () => {
    console.log('Assigned:', {
      assessmentId: selectedAssessment,
      employees: selectedEmployees,
      totalMarks,
    });
    alert('Assignment successfully created!');
  };

  const filteredEmployees = allEmployees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.id.toString().includes(search)
  );

  return (
    <Container className="py-5" style={{ marginTop: '80px' }}>
      <h4 className="mb-4">Assign New Assessment</h4>

      {step === 1 && (
        <Card className="p-4 shadow-sm mb-4">
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Assessment Link</Form.Label>
                <Form.Control
                  type="text"
                  value={link}
                  onChange={e => setLink(e.target.value)}
                  placeholder="Enter assessment link"
                />
              </Col>
              <Col md={6}>
                <Form.Label>Topic</Form.Label>
                <Form.Control
                  type="text"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="Enter topic name"
                />
              </Col>
            </Row>
            <Button onClick={handleCreateAssessment} disabled={!link || !topic}>
              Create and Continue
            </Button>
          </Form>
        </Card>
      )}

      {step === 2 && (
        <>
          <Card className="p-4 shadow-sm mb-4">
            <Form>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Label>Select Assessment</Form.Label>
                  <Form.Select
                    value={selectedAssessment}
                    onChange={e => setSelectedAssessment(Number(e.target.value))}
                  >
                    {assessments.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.topic} ({a.date})
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <Form.Label>Total Marks</Form.Label>
                  <Form.Control
                    type="number"
                    value={totalMarks}
                    onChange={e => setTotalMarks(e.target.value)}
                  />
                </Col>
              </Row>

              <Form.Label>Search and Select Employees</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by name or ID"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />

              <ListGroup className="mt-3">
                {filteredEmployees.map(emp => (
                  <ListGroup.Item
                    key={emp.id}
                    action
                    active={selectedEmployees.includes(emp.id)}
                    onClick={() => handleToggleEmployee(emp)}
                  >
                    {emp.name} (ID: {emp.id})
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <Button className="mt-4" onClick={handleAssign} disabled={!totalMarks || selectedEmployees.length === 0}>
                Assign to Selected
              </Button>
            </Form>
          </Card>
        </>
      )}
    </Container>
  );
}

export default AssignAssessment;
