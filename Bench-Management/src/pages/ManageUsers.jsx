import React, { useState } from 'react';
import { Container, Form, Button, Card, Spinner, Alert, Row, Col, Table } from 'react-bootstrap';
import './ManageUsers.css';

// --- Mock Data ---
const allEmployeesAPI = [
    { empId: 'E1024', name: 'Alice Johnson' },
    { empId: 'E1025', name: 'Bob Williams' },
    { empId: 'E1026', name: 'Charlie Brown' },
    { empId: 'E1027', name: 'Diana Miller' },
    { empId: 'E1028', name: 'Ethan Davis' },
    { empId: 'E1029', name: 'Fiona Garcia' },
    { empId: 'E1030', name: 'George Rodriguez' },
];

const initialDesignatedUsers = [
    { empId: 'E1028', name: 'Ethan Davis', role: 'Admin' },
    { empId: 'E1029', name: 'Fiona Garcia', role: 'Trainer' },
];

const initialBenchUsers = [
    { empId: 'E1024', name: 'Alice Johnson', status: 'Under Evaluation', isDeployable: true },
    { empId: 'E1025', name: 'Bob Williams', status: 'Interview In progress', isDeployable: true },
    { empId: 'E1026', name: 'Charlie Brown', status: 'Onboarding in progress', isDeployable: false },
];

const findEmployeeAPI = (query) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = allEmployeesAPI.find(
                (emp) => emp.empId.toLowerCase() === query.toLowerCase() || emp.name.toLowerCase().includes(query.toLowerCase())
            );
            if (user) resolve(user);
            else reject('Employee not found in the directory.');
        }, 800);
    });
};

function UserManagement() {
    // State for the left panel
    const [searchQuery, setSearchQuery] = useState('');
    const [foundEmployee, setFoundEmployee] = useState(null);
    const [selectedRole, setSelectedRole] = useState('Trainer');
    const [loading, setLoading] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [addSuccess, setAddSuccess] = useState('');
    const [designatedUsers, setDesignatedUsers] = useState(initialDesignatedUsers);

    // State for the right panel
    const [benchUsers, setBenchUsers] = useState(initialBenchUsers);
    const [editSuccess, setEditSuccess] = useState('');

    const statusOptions = ["Under Evaluation", "Interview In progress", "Resigned", "Sabbatical", "BU Movement", "Onboarding in progress", "Onboarded"];

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        setSearchError('');
        setAddSuccess('');
        setFoundEmployee(null);
        try {
            const user = await findEmployeeAPI(searchQuery);
            if (designatedUsers.some(du => du.empId === user.empId)) {
                setSearchError(`${user.name} is already designated as an Admin/Trainer.`);
            } else {
                setFoundEmployee(user);
            }
        } catch (err) {
            setSearchError(err);
        }
        setLoading(false);
    };

    const handleAddUser = () => {
        if (!foundEmployee) return;
        const newUser = { ...foundEmployee, role: selectedRole };
        // --- BACKEND INTEGRATION: Add Admin/Trainer ---
        console.log("Adding new Admin/Trainer:", newUser);
        setDesignatedUsers(prev => [...prev, newUser].sort((a, b) => a.name.localeCompare(b.name)));
        setAddSuccess(`${newUser.name} was successfully designated as a ${newUser.role}.`);
        setFoundEmployee(null);
        setSearchQuery('');
    };
    
    const handleTableChange = (empId, field, value) => {
        setBenchUsers(prev => prev.map(user => 
            user.empId === empId ? { ...user, [field]: value } : user
        ));
    };

    const handleSaveChanges = (empId) => {
        const userToSave = benchUsers.find(u => u.empId === empId);
        // --- BACKEND INTEGRATION: Update Bench Employee ---
        console.log("Saving changes for bench employee:", userToSave);
        setEditSuccess(`Changes for ${userToSave.name} have been saved.`);
        setTimeout(() => setEditSuccess(''), 3000);
    };

    return (
        <Container fluid className="user-management-page mt-4">
            <Row>
                {/* Left Panel: Add & View Admins/Trainers */}
                <Col md={4} className="add-user-panel">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4">Add Admin or Trainer</Card.Title>
                            <Form.Group className="mb-3">
                                <Form.Label>1. Find Employee</Form.Label>
                                <div className="d-flex">
                                    <Form.Control
                                        type="text"
                                        placeholder="Name or Employee ID"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                    <Button onClick={handleSearch} className="ms-2" disabled={loading}>
                                        {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Search'}
                                    </Button>
                                </div>
                            </Form.Group>
                            {searchError && <Alert variant="danger" size="sm" onClose={() => setSearchError('')} dismissible>{searchError}</Alert>}
                            {addSuccess && <Alert variant="success" size="sm" onClose={() => setAddSuccess('')} dismissible>{addSuccess}</Alert>}
                            {foundEmployee && (
                                <div className="found-employee-section mt-4">
                                    <p><strong>Employee Found:</strong> {foundEmployee.name} ({foundEmployee.empId})</p>
                                    <Form.Group className="mb-3">
                                        <Form.Label>2. Select a Role</Form.Label>
                                        <Form.Select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                                            <option value="Trainer">Trainer</option>
                                            <option value="Admin">Admin</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <div className="d-grid">
                                        <Button variant="primary" onClick={handleAddUser}>Add Role</Button>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm mt-4">
                        <Card.Body>
                            <Card.Title className="mb-3">Existing Admins & Trainers</Card.Title>
                            <div className="designated-users-table-container">
                                <Table hover size="sm" className="designated-users-table">
                                    <thead>
                                        <tr>
                                            <th>Emp ID</th>
                                            <th>Name</th>
                                            <th>Role</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {designatedUsers.map(user => (
                                            <tr key={user.empId}>
                                                <td>{user.empId}</td>
                                                <td>{user.name}</td>
                                                <td>
                                                    <span className={`role-badge ${user.role.toLowerCase()}-badge`}>{user.role}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Right Panel: Manage Bench Employees */}
                <Col md={8} className="manage-users-panel">
                    <Card className="shadow-sm h-100">
                        <Card.Body>
                            <Card.Title className="mb-4">Manage Bench Employees</Card.Title>
                            {editSuccess && <Alert variant="info" size="sm">{editSuccess}</Alert>}
                            <div className="table-responsive">
                                <Table hover className="manage-users-table">
                                    <thead>
                                        <tr>
                                            <th>Emp ID</th>
                                            <th>Name</th>
                                            <th>Status</th>
                                            <th>Deployable</th>
                                            <th className="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {benchUsers.map(user => (
                                            <tr key={user.empId}>
                                                <td>{user.empId}</td>
                                                <td>{user.name}</td>
                                                <td>
                                                    <Form.Select 
                                                        size="sm" 
                                                        value={user.status} 
                                                        onChange={(e) => handleTableChange(user.empId, 'status', e.target.value)}
                                                        className="form-select-sm"
                                                    >
                                                        {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                    </Form.Select>
                                                </td>
                                                <td className="text-center">
                                                    <Form.Check 
                                                        type="switch"
                                                        id={`deployable-${user.empId}`}
                                                        checked={user.isDeployable}
                                                        onChange={(e) => handleTableChange(user.empId, 'isDeployable', e.target.checked)}
                                                    />
                                                </td>
                                                <td className="text-center">
                                                    <Button variant="outline-success" size="sm" onClick={() => handleSaveChanges(user.empId)}>
                                                        Save
                                                    </Button>
                                                </td>
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

export default UserManagement;
