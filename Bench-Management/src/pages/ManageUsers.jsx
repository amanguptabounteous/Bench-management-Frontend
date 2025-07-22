import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert, ListGroup, ButtonGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserShield, faChalkboardTeacher, faUserTie, faEnvelope, faKey, faUser } from '@fortawesome/free-solid-svg-icons';
import { registerAdmin, addTrainerEmail, getAllTrainerEmails } from '../services/addAccessService';
import { addCandidateManually } from '../services/candidateService';
import { fetchFilterOptions } from '../services/benchService';
import './ManageUsers.css';

const initialCandidateState = {
    empId: '',
    name: '',
    primarySkill: '',
    level: '',
    email: '',
    departmentName: '',
    benchStartDate: '',
    isDeployable: false,
    secondarySkill: '',
    sponsorName: '',
    experience: '',
    thLink: '',
    accoliteDoj: '',
    baseLocation: '',
    personStatus: 'ONBOARDED' // Default value
};

function ManageUsers() {
    // --- State ---
    const [userType, setUserType] = useState('trainer');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [candidateForm, setCandidateForm] = useState(initialCandidateState);
    
    // --- API Feedback State ---
    const [userLoading, setUserLoading] = useState(false);
    const [userError, setUserError] = useState('');
    const [userSuccess, setUserSuccess] = useState('');
    const [candidateLoading, setCandidateLoading] = useState(false);
    const [candidateError, setCandidateError] = useState('');
    const [candidateSuccess, setCandidateSuccess] = useState('');

    // --- Data State ---
    const [trainerList, setTrainerList] = useState([]);
    const [loadingTrainers, setLoadingTrainers] = useState(true);
    const [filterOptions, setFilterOptions] = useState({ levels: [], personStatuses: [] });

    // --- Effects ---
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoadingTrainers(true);
            try {
                const [emails, options] = await Promise.all([
                    getAllTrainerEmails(),
                    fetchFilterOptions()
                ]);
                setTrainerList(emails || []);
                setFilterOptions({
                    levels: options.levels || [],
                    personStatuses: options.personStatuses || []
                });
            } catch (err) {
                console.error("Failed to fetch initial data:", err);
                setUserError("Could not load initial page data. Please refresh.");
            } finally {
                setLoadingTrainers(false);
            }
        };
        fetchInitialData();
    }, []);

    // --- Handlers ---
    const handleUserSubmit = async (e) => {
        e.preventDefault();
        setUserLoading(true);
        setUserError('');
        setUserSuccess('');
        try {
            let responseMessage = '';
            if (userType === 'trainer') {
                responseMessage = await addTrainerEmail(email);
                setTrainerList(prev => [...prev, email]);
            } else {
                if (!password) {
                    setUserError('Password is required for an admin.');
                    setUserLoading(false);
                    return;
                }
                responseMessage = await registerAdmin(email, password);
            }
            setUserSuccess(responseMessage);
            setEmail('');
            setPassword('');
        } catch (err) {
            setUserError(err.message || "An unexpected error occurred.");
        } finally {
            setUserLoading(false);
        }
    };

    const handleCandidateFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCandidateForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCandidateSubmit = async (e) => {
        e.preventDefault();
        setCandidateLoading(true);
        setCandidateError('');
        setCandidateSuccess('');
        try {
            const candidateData = {
                ...candidateForm,
                experience: parseFloat(candidateForm.experience) || 0,
                benchEndDate: null,
                blockingStatus: false,
                client: null,
                status: 'Active',
                blockedBy: null
            };
            await addCandidateManually(candidateData);
            setCandidateSuccess(`Successfully added ${candidateData.name} to the bench.`);
            setCandidateForm(initialCandidateState);
        } catch (err) {
            setCandidateError(err.message || "An unexpected error occurred.");
        } finally {
            setCandidateLoading(false);
        }
    };

    return (
        <div className="manage-users-page">
            <Container fluid>
                <h2 className="page-title">User & Candidate Management</h2>
                <Row>
                    <Col lg={5} className="mb-4">
                        <Card className="custom-card mb-4">
                            <Card.Header>
                                <FontAwesomeIcon icon={faUserPlus} /> Add User Access
                            </Card.Header>
                            <Card.Body>
                                <Form onSubmit={handleUserSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>User Type</Form.Label>
                                        <ButtonGroup className="role-selector-mu">
                                            <Button variant="primary" className={userType === 'trainer' ? 'active' : ''} onClick={() => setUserType('trainer')}><FontAwesomeIcon icon={faChalkboardTeacher} className="me-2" />Trainer</Button>
                                            <Button variant="primary" className={userType === 'admin' ? 'active' : ''} onClick={() => setUserType('admin')}><FontAwesomeIcon icon={faUserShield} className="me-2" />Admin</Button>
                                        </ButtonGroup>
                                    </Form.Group>
                                    <Form.Group className="mb-3 input-group-mu" controlId="formEmail">
                                        <FontAwesomeIcon icon={faEnvelope} className="input-icon-mu" />
                                        <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    </Form.Group>
                                    {userType === 'admin' && (
                                        <Form.Group className="mb-4 input-group-mu" controlId="formPassword">
                                            <FontAwesomeIcon icon={faKey} className="input-icon-mu" />
                                            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                        </Form.Group>
                                    )}
                                    <div className="d-grid">
                                        <Button variant="primary" type="submit" className="submit-button" disabled={userLoading}>
                                            {userLoading ? <Spinner as="span" animation="border" size="sm" /> : `Add ${userType.charAt(0).toUpperCase() + userType.slice(1)}`}
                                        </Button>
                                    </div>
                                    <div className="mt-3">
                                        {userError && <Alert variant="danger">{userError}</Alert>}
                                        {userSuccess && <Alert variant="success">{userSuccess}</Alert>}
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>

                        <Card className="custom-card">
                            <Card.Header>
                                <FontAwesomeIcon icon={faChalkboardTeacher} /> Existing Pre-Approved Trainers
                            </Card.Header>
                            <Card.Body>
                                {loadingTrainers ? (
                                    <div className="text-center"><Spinner animation="border" variant="primary" /></div>
                                ) : (
                                    <ListGroup variant="flush" className="trainer-list-container">
                                        {trainerList.length > 0 ? trainerList.map((trainerEmail, index) => (
                                            <ListGroup.Item key={index}>
                                                <FontAwesomeIcon icon={faUser} className="trainer-icon" />
                                                {trainerEmail}
                                            </ListGroup.Item>
                                        )) : <p className="text-muted text-center mt-3">No pre-approved trainers found.</p>}
                                    </ListGroup>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={7} className="mb-4">
                        <Card className="custom-card h-100">
                            <Card.Header>
                                <FontAwesomeIcon icon={faUserTie} /> Add Candidate to Bench Manually
                            </Card.Header>
                            <Card.Body>
                                <Form onSubmit={handleCandidateSubmit}>
                                    <Row className="g-3">
                                        <Col md={4}><Form.Group><Form.Label>Employee ID</Form.Label><Form.Control type="number" name="empId" value={candidateForm.empId} onChange={handleCandidateFormChange} required /></Form.Group></Col>
                                        <Col md={4}><Form.Group><Form.Label>Full Name</Form.Label><Form.Control type="text" name="name" value={candidateForm.name} onChange={handleCandidateFormChange} required /></Form.Group></Col>
                                        <Col md={4}><Form.Group><Form.Label>Email</Form.Label><Form.Control type="email" name="email" value={candidateForm.email} onChange={handleCandidateFormChange} required /></Form.Group></Col>
                                        <Col md={4}><Form.Group><Form.Label>Primary Skill</Form.Label><Form.Control type="text" name="primarySkill" value={candidateForm.primarySkill} onChange={handleCandidateFormChange} required /></Form.Group></Col>
                                        <Col md={4}><Form.Group><Form.Label>Secondary Skill</Form.Label><Form.Control type="text" name="secondarySkill" value={candidateForm.secondarySkill} onChange={handleCandidateFormChange} /></Form.Group></Col>
                                        <Col md={4}><Form.Group><Form.Label>Level</Form.Label><Form.Select name="level" value={candidateForm.level} onChange={handleCandidateFormChange} required><option value="">Select Level...</option>{filterOptions.levels.map(l => <option key={l} value={l}>{l}</option>)}</Form.Select></Form.Group></Col>
                                        <Col md={3}><Form.Group><Form.Label>Experience (Years)</Form.Label><Form.Control type="number" step="0.1" name="experience" value={candidateForm.experience} onChange={handleCandidateFormChange} required /></Form.Group></Col>
                                        <Col md={3}><Form.Group><Form.Label>Department</Form.Label><Form.Control type="text" name="departmentName" value={candidateForm.departmentName} onChange={handleCandidateFormChange} /></Form.Group></Col>
                                        <Col md={3}><Form.Group><Form.Label>Base Location</Form.Label><Form.Control type="text" name="baseLocation" value={candidateForm.baseLocation} onChange={handleCandidateFormChange} /></Form.Group></Col>
                                        <Col md={3}><Form.Group><Form.Label>Sponsor Name</Form.Label><Form.Control type="text" name="sponsorName" value={candidateForm.sponsorName} onChange={handleCandidateFormChange} /></Form.Group></Col>
                                        <Col md={3}><Form.Group><Form.Label>Date of Joining</Form.Label><Form.Control type="date" name="accoliteDoj" value={candidateForm.accoliteDoj} onChange={handleCandidateFormChange} required /></Form.Group></Col>
                                        <Col md={3}><Form.Group><Form.Label>Bench Start Date</Form.Label><Form.Control type="date" name="benchStartDate" value={candidateForm.benchStartDate} onChange={handleCandidateFormChange} required /></Form.Group></Col>
                                        <Col md={3}><Form.Group><Form.Label>TH Link</Form.Label><Form.Control type="text" name="thLink" value={candidateForm.thLink} onChange={handleCandidateFormChange} /></Form.Group></Col>
                                        <Col md={3}><Form.Group><Form.Label>Person Status</Form.Label><Form.Select name="personStatus" value={candidateForm.personStatus} onChange={handleCandidateFormChange} required><option value="">Select Status...</option>{filterOptions.personStatuses.map(s => <option key={s} value={s}>{s}</option>)}</Form.Select></Form.Group></Col>
                                    </Row>
                                    
                                    {/* ✨ NEW: Final row for actions */}
                                    <Row className="mt-4 align-items-center justify-content-between">
                                        
                                        <Col xs="auto" className='m-3'>
                                            <Form.Check
                                                type="switch"
                                                id="isDeployable-switch"
                                                name="isDeployable"
                                                label="Is Deployable"
                                                checked={candidateForm.isDeployable}
                                                onChange={handleCandidateFormChange}
                                            />
                                        </Col>
                                        <Col xs="auto">
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                className="submit-button"
                                                disabled={candidateLoading}
                                                style={{ minWidth: '150px' }}
                                            >
                                                {candidateLoading ? <Spinner as="span" animation="border" size="sm" /> : 'Add Candidate'}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                                <div className="mt-3">
                                    {candidateError && <Alert variant="danger">{candidateError}</Alert>}
                                    {candidateSuccess && <Alert variant="success">{candidateSuccess}</Alert>}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default ManageUsers;
