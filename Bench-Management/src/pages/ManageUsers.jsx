import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert, ListGroup, ButtonGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserShield, faChalkboardTeacher, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { registerAdmin, addTrainerEmail, getAllTrainerEmails } from '../services/addAccessService';
// ✨ NEW: Importing the new service for adding candidates
import { addCandidateManually } from '../services/candidateService';
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
    // State for the Add User form
    const [userType, setUserType] = useState('trainer');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // State for the Add Candidate form
    const [candidateForm, setCandidateForm] = useState(initialCandidateState);

    // State for API feedback
    const [userLoading, setUserLoading] = useState(false);
    const [userError, setUserError] = useState('');
    const [userSuccess, setUserSuccess] = useState('');
    const [candidateLoading, setCandidateLoading] = useState(false);
    const [candidateError, setCandidateError] = useState('');
    const [candidateSuccess, setCandidateSuccess] = useState('');

    // State for displaying existing trainers
    const [trainerList, setTrainerList] = useState([]);
    const [loadingTrainers, setLoadingTrainers] = useState(true);

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                setLoadingTrainers(true);
                const emails = await getAllTrainerEmails();
                setTrainerList(emails || []);
            } catch (err) {
                console.error("Failed to fetch trainers:", err);
            } finally {
                setLoadingTrainers(false);
            }
        };
        fetchTrainers();
    }, []);

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
            setUserError(err.message);
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
            // Prepare data object, converting experience to a number
            const candidateData = {
                ...candidateForm,
                experience: parseFloat(candidateForm.experience) || 0,
                // Set other non-form fields to null or default values if needed
                benchEndDate: null,
                blockingStatus: false,
                client: null,
                status: 'Active', // Or derive from personStatus
                blockedBy: null
            };

            await addCandidateManually(candidateData);
            setCandidateSuccess(`Successfully added ${candidateData.name} to the bench.`);
            setCandidateForm(initialCandidateState); // Reset form
        } catch (err) {
            setCandidateError(err.message);
        } finally {
            setCandidateLoading(false);
        }
    };

    return (
        <Container fluid className="manage-users-page p-4">
            <h2 className="mb-4 fw-light">User & Candidate Management</h2>
            <Row>
                {/* Add User Section */}
                <Col lg={5} className="mb-4">
                    <Card className="h-100 shadow-sm">
                        <Card.Header as="h5" className="bg-light fw-normal">
                            <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                            Add User Access
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Form onSubmit={handleUserSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>User Type</Form.Label>
                                    <ButtonGroup className="w-100">
                                        <Button variant={userType === 'trainer' ? 'primary' : 'outline-primary'} onClick={() => setUserType('trainer')}><FontAwesomeIcon icon={faChalkboardTeacher} className="me-2" />Trainer</Button>
                                        <Button variant={userType === 'admin' ? 'primary' : 'outline-primary'} onClick={() => setUserType('admin')}><FontAwesomeIcon icon={faUserShield} className="me-2" />Admin</Button>
                                    </ButtonGroup>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </Form.Group>
                                {userType === 'admin' && (
                                    <Form.Group className="mb-4" controlId="formPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    </Form.Group>
                                )}
                                <div className="d-grid">
                                    <Button variant="primary" type="submit" disabled={userLoading}>
                                        {userLoading ? <Spinner as="span" animation="border" size="sm" /> : `Add ${userType.charAt(0).toUpperCase() + userType.slice(1)}`}
                                    </Button>
                                </div>
                            </Form>
                            <div className="mt-3">
                                {userError && <Alert variant="danger">{userError}</Alert>}
                                {userSuccess && <Alert variant="success">{userSuccess}</Alert>}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Existing Trainers List */}
                <Col lg={7} className="mb-4">
                    <Card className="h-100 shadow-sm">
                        <Card.Header as="h5" className="bg-light fw-normal">
                            <FontAwesomeIcon icon={faChalkboardTeacher} className="me-2" />
                            Existing Pre-Approved Trainers
                        </Card.Header>
                        <Card.Body>
                            {loadingTrainers ? (
                                <div className="text-center"><Spinner animation="border" variant="primary" /></div>
                            ) : (
                                <ListGroup variant="flush" className="trainer-list-container">
                                    {trainerList.length > 0 ? trainerList.map((trainer, index) => (
                                        <ListGroup.Item key={index}>{trainer}</ListGroup.Item>
                                    )) : <p className="text-muted text-center mt-3">No trainers have been added yet.</p>}
                                </ListGroup>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Add Candidate Section */}
            <Row>
                <Col>
                    <Card className="shadow-sm">
                        <Card.Header as="h5" className="bg-light fw-normal">
                            <FontAwesomeIcon icon={faUserTie} className="me-2" />
                            Add Candidate to Bench Manually
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Form onSubmit={handleCandidateSubmit}>
                                <Row className="g-3">
                                    <Col md={4}><Form.Group><Form.Label>Employee ID</Form.Label><Form.Control type="number" name="empId" value={candidateForm.empId} onChange={handleCandidateFormChange} required /></Form.Group></Col>
                                    <Col md={4}><Form.Group><Form.Label>Full Name</Form.Label><Form.Control type="text" name="name" value={candidateForm.name} onChange={handleCandidateFormChange} required /></Form.Group></Col>
                                    <Col md={4}><Form.Group><Form.Label>Email</Form.Label><Form.Control type="email" name="email" value={candidateForm.email} onChange={handleCandidateFormChange} required /></Form.Group></Col>
                                    
                                    <Col md={4}><Form.Group><Form.Label>Primary Skill</Form.Label><Form.Control type="text" name="primarySkill" value={candidateForm.primarySkill} onChange={handleCandidateFormChange} required /></Form.Group></Col>
                                    <Col md={4}><Form.Group><Form.Label>Secondary Skill</Form.Label><Form.Control type="text" name="secondarySkill" value={candidateForm.secondarySkill} onChange={handleCandidateFormChange} /></Form.Group></Col>
                                    <Col md={4}><Form.Group><Form.Label>Level</Form.Label><Form.Control type="text" name="level" value={candidateForm.level} onChange={handleCandidateFormChange} /></Form.Group></Col>

                                    <Col md={3}><Form.Group><Form.Label>Experience (Years)</Form.Label><Form.Control type="number" step="0.1" name="experience" value={candidateForm.experience} onChange={handleCandidateFormChange} required /></Form.Group></Col>
                                    <Col md={3}><Form.Group><Form.Label>Department</Form.Label><Form.Control type="text" name="departmentName" value={candidateForm.departmentName} onChange={handleCandidateFormChange} /></Form.Group></Col>
                                    <Col md={3}><Form.Group><Form.Label>Base Location</Form.Label><Form.Control type="text" name="baseLocation" value={candidateForm.baseLocation} onChange={handleCandidateFormChange} /></Form.Group></Col>
                                    <Col md={3}><Form.Group><Form.Label>Sponsor Name</Form.Label><Form.Control type="text" name="sponsorName" value={candidateForm.sponsorName} onChange={handleCandidateFormChange} /></Form.Group></Col>
                                    
                                    <Col md={3}><Form.Group><Form.Label>Date of Joining</Form.Label><Form.Control type="date" name="accoliteDoj" value={candidateForm.accoliteDoj} onChange={handleCandidateFormChange} required /></Form.Group></Col>
                                    <Col md={3}><Form.Group><Form.Label>Bench Start Date</Form.Label><Form.Control type="date" name="benchStartDate" value={candidateForm.benchStartDate} onChange={handleCandidateFormChange} required /></Form.Group></Col>
                                    <Col md={3}><Form.Group><Form.Label>TH Link</Form.Label><Form.Control type="text" name="thLink" value={candidateForm.thLink} onChange={handleCandidateFormChange} /></Form.Group></Col>
                                    <Col md={3}><Form.Group><Form.Label>Person Status</Form.Label><Form.Select name="personStatus" value={candidateForm.personStatus} onChange={handleCandidateFormChange}><option>ONBOARDED</option><option>SABBATICAL</option><option>UNDER_EVALUATION</option></Form.Select></Form.Group></Col>
                                    
                                    <Col xs={12}><Form.Check type="switch" id="isDeployable-switch" name="isDeployable" label="Is Deployable" checked={candidateForm.isDeployable} onChange={handleCandidateFormChange} /></Col>
                                </Row>

                                <div className="d-flex justify-content-end mt-4">
                                    <Button variant="primary" type="submit" disabled={candidateLoading} style={{minWidth: '150px'}}>
                                        {candidateLoading ? <Spinner as="span" animation="border" size="sm" /> : 'Add Candidate'}
                                    </Button>
                                </div>
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
    );
}

export default ManageUsers;
