import React, { useState, useMemo } from "react";
import {
  Container,
  Table,
  Form,
  Spinner,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import "./BenchHomepage.css"; // Import the separate CSS file

// --- Mock Data & Hook (Expanded to 20 people with decimal YoE) ---
const mockBenchData = [
  { empId: 'E1024', name: 'Alice Johnson', primarySkill: 'React', level: 'L3', yearsOfExperience: 5.2, baseLocation: 'New York', currentLocation: 'New York', agingDays: 15, isDeployable: true, status: 'Under Evaluation', currentOwner: 'HR Team', thlink: 'https://example.com/th/E1024', assessments: { 'Hooks': 95, 'Redux': 88, 'Context API': 92 }, departmentName: 'Engineering', benchStartDate: '2024-06-15', benchEndDate: null, remarks: [], trainerFeedback: [] },
  { empId: 'E1025', name: 'Bob Williams', primarySkill: 'Java', level: 'L4', yearsOfExperience: 8.6, baseLocation: 'San Francisco', currentLocation: 'Chicago', agingDays: 45, isDeployable: true, status: 'Interview In progress', currentOwner: 'Sales Team', thlink: 'https://example.com/th/E1025', assessments: { 'Collections': 90, 'Multithreading': null, 'Spring Boot': 95 }, departmentName: 'Engineering', benchStartDate: '2024-05-16', benchEndDate: null, remarks: [], trainerFeedback: [] },
  { empId: 'E1026', name: 'Charlie Brown', primarySkill: 'Python', level: 'L2', yearsOfExperience: 2.1, baseLocation: 'Chicago', currentLocation: 'Chicago', agingDays: 5, isDeployable: false, status: 'Onboarding in progress', currentOwner: 'Data Science Team', thlink: 'https://example.com/th/E1026', assessments: { 'Data Structures': 88, 'Pandas': 82, 'APIs': 90 }, departmentName: 'Data Science', benchStartDate: '2024-06-25', benchEndDate: null, remarks: [], trainerFeedback: [] },
  { empId: 'E1027', name: 'Diana Prince', primarySkill: 'Angular', level: 'L3', yearsOfExperience: 4.5, baseLocation: 'Austin', currentLocation: 'Austin', agingDays: 25, isDeployable: true, status: 'Under Evaluation', currentOwner: 'HR Team', thlink: 'https://example.com/th/E1027', assessments: { 'TypeScript': 91, 'RxJS': 85, 'NgRx': 89 }, departmentName: 'Engineering', benchStartDate: '2024-06-05', benchEndDate: null, remarks: [], trainerFeedback: [] },
  { empId: 'E1028', name: 'Ethan Hunt', primarySkill: 'DevOps', level: 'L5', yearsOfExperience: 10.0, baseLocation: 'Remote', currentLocation: 'Remote', agingDays: 12, isDeployable: true, status: 'Sabbatical', currentOwner: 'IT Operations', thlink: 'https://example.com/th/E1028', assessments: { 'Docker': 94, 'Kubernetes': 96, 'CI/CD': 92 }, departmentName: 'Operations', benchStartDate: '2024-06-18', benchEndDate: null, remarks: [], trainerFeedback: [] },
  { empId: 'E1029', name: 'Fiona Glenanne', primarySkill: 'Java', level: 'L3', yearsOfExperience: 6.3, baseLocation: 'Miami', currentLocation: 'Miami', agingDays: 55, isDeployable: true, status: 'Interview In progress', currentOwner: 'Sales Team', thlink: 'https://example.com/th/E1029', assessments: { 'Collections': 88, 'Multithreading': 91, 'Spring Boot': 85 }, departmentName: 'Engineering', benchStartDate: '2024-05-06', benchEndDate: null, remarks: [], trainerFeedback: [] },
  { empId: 'E1030', name: 'George Costanza', primarySkill: 'React', level: 'L2', yearsOfExperience: 1.5, baseLocation: 'New York', currentLocation: 'New York', agingDays: 80, isDeployable: false, status: 'Resigned', currentOwner: 'HR Team', thlink: 'https://example.com/th/E1030', assessments: { 'Hooks': 75, 'Redux': null, 'Context API': 80 }, departmentName: 'Vandelay Industries', benchStartDate: '2024-04-21', benchEndDate: '2024-07-10', remarks: [], trainerFeedback: [] },
  { empId: 'E1031', name: 'Hannah Montana', primarySkill: '.NET', level: 'L4', yearsOfExperience: 7.8, baseLocation: 'Los Angeles', currentLocation: 'Nashville', agingDays: 33, isDeployable: true, status: 'Under Evaluation', currentOwner: 'Enterprise Team', thlink: 'https://example.com/th/E1031', assessments: { 'Core': 93, 'MVC': 90, 'Entity Framework': 88 }, departmentName: 'Music', benchStartDate: '2024-05-28', benchEndDate: null, remarks: [], trainerFeedback: [] },
  { empId: 'E1032', name: 'Ian Malcolm', primarySkill: 'Python', level: 'L5', yearsOfExperience: 15.1, baseLocation: 'Isla Nublar', currentLocation: 'Austin', agingDays: 40, isDeployable: true, status: 'Interview In progress', currentOwner: 'Chaos Theory Dept', thlink: 'https://example.com/th/E1032', assessments: { 'Data Structures': 95, 'Pandas': 98, 'APIs': 94 }, departmentName: 'Science', benchStartDate: '2024-05-21', benchEndDate: null, remarks: [], trainerFeedback: [] },
  { empId: 'E1033', name: 'Jack Sparrow', primarySkill: 'Go', level: 'L3', yearsOfExperience: 4.9, baseLocation: 'Caribbean', currentLocation: 'Tortuga', agingDays: 92, isDeployable: false, status: 'Under Evaluation', currentOwner: 'Admiralty', thlink: 'https://example.com/th/E1033', assessments: { 'Goroutines': 89, 'Channels': null, 'Interfaces': 85 }, departmentName: 'Shipping', benchStartDate: '2024-04-09', benchEndDate: null, remarks: [], trainerFeedback: [] },
  { empId: 'E1034', name: 'Kara Danvers', primarySkill: 'UI/UX', level: 'L3', yearsOfExperience: 3.4, baseLocation: 'National City', currentLocation: 'National City', agingDays: 18, isDeployable: true, status: 'BU Movement', currentOwner: 'CatCo Media', thlink: 'https://example.com/th/E1034', assessments: { 'Figma': 96, 'User Research': 91, 'Prototyping': 93 }, departmentName: 'Media', benchStartDate: '2024-06-12', benchEndDate: null, remarks: [], trainerFeedback: [] },
  { empId: 'E1035', name: 'Luke Skywalker', primarySkill: 'React', level: 'L4', yearsOfExperience: 8.2, baseLocation: 'Tatooine', currentLocation: 'Yavin 4', agingDays: 65, isDeployable: true, status: 'Onboarding in progress', currentOwner: 'Rebel Alliance', thlink: 'https://example.com/th/E1035', assessments: { 'Hooks': 98, 'Redux': 95, 'Context API': 96 }, departmentName: 'Special Ops', benchStartDate: '2024-05-06', benchEndDate: null, remarks: [], trainerFeedback: [] },
  { empId: 'E1036', name: 'Michael Scott', primarySkill: 'Salesforce', level: 'L5', yearsOfExperience: 15.0, baseLocation: 'Scranton', currentLocation: 'Scranton', agingDays: 3, isDeployable: true, status: 'Under Evaluation', currentOwner: 'Corporate', thlink: 'https://example.com/th/E1036', assessments: { 'Apex': 80, 'Visualforce': 75, 'SOQL': 85 }, departmentName: 'Paper', benchStartDate: '2024-07-07', benchEndDate: null, remarks: [], trainerFeedback: [] },
  { empId: 'E1037', name: 'Neo Anderson', primarySkill: 'Java', level: 'L3', yearsOfExperience: 6.7, baseLocation: 'Mega City', currentLocation: 'Zion', agingDays: 28, isDeployable: true, status: 'Interview In progress', currentOwner: 'Morpheus', thlink: 'https://example.com/th/E1037', assessments: { 'Collections': 99, 'Multithreading': 98, 'Spring Boot': 97 }, departmentName: 'Software', benchStartDate: '2024-06-02', benchEndDate: null, remarks: [], trainerFeedback: [] },
  { empId: 'E1038', name: 'Olivia Benson', primarySkill: 'Project Management', level: 'L5', yearsOfExperience: 12.5, baseLocation: 'New York', currentLocation: 'New York', agingDays: 11, isDeployable: true, status: 'Under Evaluation', currentOwner: 'SVU', thlink: 'https://example.com/th/E1038', assessments: { 'Agile': 95, 'Scrum': 92, 'Budgeting': 90 }, departmentName: 'Law Enforcement', benchStartDate: '2024-06-19', benchEndDate: null, remarks: [], trainerFeedback: [] },
  { empId: 'E1039', name: 'Peter Parker', primarySkill: 'React', level: 'L2', yearsOfExperience: 2.8, baseLocation: 'New York', currentLocation: 'New York', agingDays: 48, isDeployable: true, status: 'Interview In progress', currentOwner: 'Daily Bugle', thlink: 'https://example.com/th/E1039', assessments: { 'Hooks': 92, 'Redux': 85, 'Context API': null }, departmentName: 'Photography', benchStartDate: '2024-05-13', benchEndDate: null, remarks: [], trainerFeedback: [] },
  { empId: 'E1040', name: 'Quinn Fabray', primarySkill: 'UI/UX', level: 'L3', yearsOfExperience: 4.1, baseLocation: 'Lima', currentLocation: 'New Haven', agingDays: 72, isDeployable: false, status: 'Sabbatical', currentOwner: 'HR Team', thlink: 'https://example.com/th/E1040', assessments: { 'Figma': 90, 'User Research': null, 'Prototyping': 88 }, departmentName: 'Arts', benchStartDate: '2024-04-29', benchEndDate: null, remarks: [], trainerFeedback: [] },
  { empId: 'E1041', name: 'Rachel Green', primarySkill: 'Fashion Design', level: 'L4', yearsOfExperience: 7.3, baseLocation: 'New York', currentLocation: 'Paris', agingDays: 20, isDeployable: true, status: 'BU Movement', currentOwner: 'Ralph Lauren', thlink: 'https://example.com/th/E1041', assessments: { 'Sketching': 94, 'Textiles': 89, 'Merchandising': 91 }, departmentName: 'Fashion', benchStartDate: '2024-06-10', benchEndDate: null, remarks: [], trainerFeedback: [] },
  { empId: 'E1042', name: 'Steve Rogers', primarySkill: 'Leadership', level: 'L5', yearsOfExperience: 10.0, baseLocation: 'Brooklyn', currentLocation: 'Washington D.C.', agingDays: 98, isDeployable: true, status: 'Under Evaluation', currentOwner: 'S.H.I.E.L.D.', thlink: 'https://example.com/th/E1042', assessments: { 'Strategy': 100, 'Tactics': 100, 'Motivation': 100 }, departmentName: 'Defense', benchStartDate: '2024-04-03', benchEndDate: null, remarks: [], trainerFeedback: [] },
  { empId: 'E1043', name: 'Tony Stark', primarySkill: 'DevOps', level: 'L5', yearsOfExperience: 16.1, baseLocation: 'Malibu', currentLocation: 'New York', agingDays: 30, isDeployable: true, status: 'Onboarded', currentOwner: 'Avengers', thlink: 'https://example.com/th/E1043', assessments: { 'Docker': 100, 'Kubernetes': 100, 'CI/CD': 100 }, departmentName: 'R&D', benchStartDate: '2024-06-01', benchEndDate: '2024-06-30', remarks: [], trainerFeedback: [] },
];
const useBenchData = () => {
  const [data, setData] = useState(mockBenchData);
  const [loading, setLoading] = useState(true);
  React.useEffect(() => { setTimeout(() => setLoading(false), 1000); }, []);
  return { benchData: data, setBenchData: setData, loading };
};
// --- End Mock Data ---

// --- Helper function to calculate assessment average and completion ---
const calculateAssessment = (assessments) => {
    if (!assessments || typeof assessments !== 'object') {
        return { average: 0, complete: false };
    }
    const scores = Object.values(assessments);
    const validScores = scores.filter(score => score !== null && score !== undefined);
    const complete = validScores.length === scores.length;
    const average = validScores.length > 0 ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : 0;
    return { average, complete };
};

// --- SVG Icon Component for the Collapse Button ---
const CollapseIcon = ({ isCollapsed }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`collapse-icon ${isCollapsed ? 'collapsed' : ''}`}>
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);


function BenchHomepage() {
  const { benchData, setBenchData, loading } = useBenchData();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [newRemarks, setNewRemarks] = useState({});
  const [editedData, setEditedData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "agingDays", direction: "desc" }); // Default sort
  const [filterDeployable, setFilterDeployable] = useState(false);
  const [filterLevels, setFilterLevels] = useState([]);
  const [filterLocations, setFilterLocations] = useState([]);
  const [filterSkills, setFilterSkills] = useState([]);
  const [filterStatuses, setFilterStatuses] = useState([]);
  const [filterOwners, setFilterOwners] = useState([]);
  const [filterYoe, setFilterYoe] = useState([]);

  const uniqueLevels = [...new Set(benchData.map((emp) => emp.level))].sort();
  const uniqueLocations = [...new Set(benchData.map((emp) => emp.currentLocation))].sort();
  const uniqueSkills = [...new Set(benchData.map((emp) => emp.primarySkill))].sort();
  const uniqueStatuses = ["Under Evaluation", "Interview In progress", "Resigned", "Sabbatical", "BU Movement", "Onboarding in progress", "Onboarded"];
  const uniqueOwners = [...new Set(benchData.map((emp) => emp.currentOwner))].sort();
  const yoeRanges = ["0-2", "3-5", "6-8", "9+"];

  const handleMultiSelectChange = (setter, value) => {
    setter((prev) => prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]);
  };

  const handleRowClick = (empId) => {
    setExpandedRow(expandedRow === empId ? null : empId);
  };

  const handleRemarkChange = (empId, value) => {
    setNewRemarks(prev => ({ ...prev, [empId]: value }));
  };

  const handleAddRemark = (empId) => {
    const remarkText = newRemarks[empId];
    if (!remarkText || !remarkText.trim()) return;
    const newRemark = { date: new Date().toISOString().split('T')[0], text: remarkText };
    setBenchData(prevData => prevData.map(person => person.empId === empId ? { ...person, remarks: [...person.remarks, newRemark] } : person));
    handleRemarkChange(empId, '');
  };

  const handleFieldChange = (empId, field, value) => {
    setEditedData(prev => ({ ...prev, [empId]: { ...prev[empId], [field]: value } }));
  };

  const handleSaveChanges = (empId) => {
    const edits = editedData[empId];
    if (!edits) return;
    console.log("Saving changes for", empId, edits);
    setBenchData(prevData => prevData.map(person => person.empId === empId ? { ...person, ...edits } : person));
    setEditedData(prev => { const newEditedData = { ...prev }; delete newEditedData[empId]; return newEditedData; });
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const clearFilters = () => {
    setSearchTerm(""); setFilterDeployable(false); setFilterLevels([]); setFilterLocations([]); setFilterSkills([]); setFilterStatuses([]); setFilterOwners([]); setFilterYoe([]);
  };

  const filteredAndSortedData = useMemo(() => {
    let sortableItems = [...benchData];

    // Sorting logic
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    // Filtering logic
    return sortableItems.filter((person) => {
        const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) || person.empId.toString().includes(searchTerm);
        const matchesDeployable = !filterDeployable || person.isDeployable;
        const matchesLevel = filterLevels.length === 0 || filterLevels.includes(person.level);
        const matchesLocation = filterLocations.length === 0 || filterLocations.includes(person.currentLocation);
        const matchesSkill = filterSkills.length === 0 || filterSkills.includes(person.primarySkill);
        const matchesStatus = filterStatuses.length === 0 || filterStatuses.includes(person.status);
        const matchesOwner = filterOwners.length === 0 || filterOwners.includes(person.currentOwner);
        const matchesYoe = filterYoe.length === 0 || filterYoe.some(range => {
          const exp = person.yearsOfExperience;
          if (range.includes('+')) { const min = parseInt(range, 10); return exp >= min; }
          const [min, max] = range.split('-').map(Number); return exp >= min && exp <= max;
        });
        return matchesSearch && matchesDeployable && matchesLevel && matchesLocation && matchesSkill && matchesStatus && matchesOwner && matchesYoe;
      });
  }, [benchData, searchTerm, filterDeployable, sortConfig, filterLevels, filterLocations, filterSkills, filterStatuses, filterOwners, filterYoe]);
  
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <FontAwesomeIcon icon={faSortDown} className="sort-icon" />;
    return sortConfig.direction === 'asc' ? <FontAwesomeIcon icon={faSortUp} className="sort-icon active" /> : <FontAwesomeIcon icon={faSortDown} className="sort-icon active" />;
  };

  return (
    <div className={`bench-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="filter-sidebar">
        <div className="sidebar-header">
          <h4 className="sidebar-title"><FontAwesomeIcon icon={faFilter} className="me-2" /> Filters</h4>
          <Button variant="light" onClick={() => setSidebarCollapsed(!isSidebarCollapsed)} className="collapse-btn"> <FontAwesomeIcon icon={faFilter} /> </Button>
        </div>

        <div className="sidebar-content">
          <Form.Group className="filter-group" controlId="searchFilter">
            <Form.Label>Search</Form.Label>
            <Form.Control type="text" placeholder="Name or Emp ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </Form.Group>
          <Form.Group className="filter-group" controlId="statusFilter">
            <Form.Label>Status</Form.Label>
            <div className="bubble-container">
              {uniqueStatuses.map((status) => (<button key={status} className={`filter-bubble ${filterStatuses.includes(status) ? 'selected' : ''}`} onClick={() => handleMultiSelectChange(setFilterStatuses, status)}>{status}</button>))}
            </div>
          </Form.Group>
          <Form.Group className="filter-group" controlId="ownerFilter">
            <Form.Label>Current Owner</Form.Label>
            <div className="bubble-container">
              {uniqueOwners.map((owner) => (<button key={owner} className={`filter-bubble ${filterOwners.includes(owner) ? 'selected' : ''}`} onClick={() => handleMultiSelectChange(setFilterOwners, owner)}>{owner}</button>))}
            </div>
          </Form.Group>
          <Form.Group className="filter-group" controlId="yoeFilter">
            <Form.Label>Years of Experience</Form.Label>
            <div className="bubble-container">
              {yoeRanges.map((range) => (<button key={range} className={`filter-bubble ${filterYoe.includes(range) ? 'selected' : ''}`} onClick={() => handleMultiSelectChange(setFilterYoe, range)}>{range}</button>))}
            </div>
          </Form.Group>
          <Form.Group className="filter-group" controlId="levelFilter">
            <Form.Label>Level</Form.Label>
            <div className="bubble-container">
              {uniqueLevels.map((level) => (<button key={level} className={`filter-bubble ${filterLevels.includes(level) ? 'selected' : ''}`} onClick={() => handleMultiSelectChange(setFilterLevels, level)}>{level}</button>))}
            </div>
          </Form.Group>
          <Form.Group className="filter-group" controlId="skillFilter">
            <Form.Label>Primary Skill</Form.Label>
            <div className="bubble-container">
              {uniqueSkills.map((skill) => (<button key={skill} className={`filter-bubble ${filterSkills.includes(skill) ? 'selected' : ''}`} onClick={() => handleMultiSelectChange(setFilterSkills, skill)}>{skill}</button>))}
            </div>
          </Form.Group>
          <Form.Group className="filter-group" controlId="locationFilter">
            <Form.Label>Current Location</Form.Label>
            <div className="bubble-container">
              {uniqueLocations.map((loc) => (<button key={loc} className={`filter-bubble ${filterLocations.includes(loc) ? 'selected' : ''}`} onClick={() => handleMultiSelectChange(setFilterLocations, loc)}>{loc}</button>))}
            </div>
          </Form.Group>
          <Form.Group className="filter-group" controlId="deployableFilter">
            <Form.Check type="switch" id="deployable-switch" label="Only Deployable" checked={filterDeployable} onChange={(e) => setFilterDeployable(e.target.checked)} />
          </Form.Group>
          <Button variant="outline-secondary" size="sm" className="w-100 mt-4" onClick={clearFilters}>Clear All Filters</Button>
        </div>
      </div>

      <div className="main-content">
        <Container fluid>
          <h2 className="mb-4">Bench Dashboard</h2>
          {loading ? ( <div className="text-center"><Spinner animation="border" variant="primary" /></div> ) : (
            <Table bordered hover responsive className="bench-table shadow-sm align-middle">
              <thead>
                <tr>
                  <th className="sortable-header" onClick={() => handleSort('empId')}>Emp ID {renderSortIcon('empId')}</th>
                  <th className="sortable-header" onClick={() => handleSort('name')}>Name {renderSortIcon('name')}</th>
                  <th className="sortable-header" onClick={() => handleSort('primarySkill')}>Primary Skill {renderSortIcon('primarySkill')}</th>
                  <th className="sortable-header" onClick={() => handleSort('level')}>Level {renderSortIcon('level')}</th>
                  <th className="sortable-header" onClick={() => handleSort('yearsOfExperience')}>Yrs of Exp {renderSortIcon('yearsOfExperience')}</th>
                  <th className="sortable-header" onClick={() => handleSort('baseLocation')}>Base Location {renderSortIcon('baseLocation')}</th>
                  <th className="sortable-header" onClick={() => handleSort('currentLocation')}>Current Location {renderSortIcon('currentLocation')}</th>
                  <th className="sortable-header" onClick={() => handleSort('agingDays')}>Aging {renderSortIcon('agingDays')}</th>
                  <th>Deployable</th>
                  <th className="sortable-header" onClick={() => handleSort('status')}>Status {renderSortIcon('status')}</th>
                  <th className="sortable-header" onClick={() => handleSort('currentOwner')}>Current Owner {renderSortIcon('currentOwner')}</th>
                  <th>Assessment</th>
                  <th>TH Link</th>
                  <th className="action-column-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedData.map((person) => {
                    const currentPersonData = { ...person, ...editedData[person.empId] };
                    const { average, complete } = calculateAssessment(person.assessments);
                    return (
                    <React.Fragment key={person.empId}>
                      <tr className="clickable-row" onClick={() => handleRowClick(person.empId)}>
                        <td>{person.empId}</td>
                        <td><Link to={`/dashboard/${person.empId}`} className="employee-link" onClick={(e) => e.stopPropagation()}>{person.name}</Link></td>
                        <td>{person.primarySkill}</td>
                        <td>{person.level}</td>
                        <td><Form.Control type="number" step="0.1" size="sm" className="editable-field" value={currentPersonData.yearsOfExperience} onChange={(e) => handleFieldChange(person.empId, 'yearsOfExperience', Number(e.target.value))} onClick={(e) => e.stopPropagation()} /></td>
                        <td>{person.baseLocation}</td>
                        <td><Form.Control type="text" size="sm" className="editable-field" value={currentPersonData.currentLocation} onChange={(e) => handleFieldChange(person.empId, 'currentLocation', e.target.value)} onClick={(e) => e.stopPropagation()} /></td>
                        <td><OverlayTrigger placement="top" overlay={<Tooltip>Dept: {person.departmentName}<br />Bench: {person.benchStartDate} to {person.benchEndDate}</Tooltip>}><span className="aging-tooltip">{person.agingDays} days</span></OverlayTrigger></td>
                        <td className="text-center"><Form.Check type="switch" id={`deployable-${person.empId}`} checked={currentPersonData.isDeployable} onChange={(e) => handleFieldChange(person.empId, 'isDeployable', e.target.checked)} onClick={(e) => e.stopPropagation()} /></td>
                        <td><Form.Select size="sm" className="editable-field" value={currentPersonData.status} onChange={(e) => handleFieldChange(person.empId, 'status', e.target.value)} onClick={(e) => e.stopPropagation()}>{uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}</Form.Select></td>
                        <td><Form.Control type="text" size="sm" className="editable-field" value={currentPersonData.currentOwner} onChange={(e) => handleFieldChange(person.empId, 'currentOwner', e.target.value)} onClick={(e) => e.stopPropagation()} /></td>
                        <td><span className={complete ? 'assessment-complete' : 'assessment-incomplete'}>{average}%</span></td>
                        <td><a href={person.thlink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>Link</a></td>
                        <td className="action-column-cell">
                            <Button variant="success" size="sm" disabled={!editedData[person.empId]} onClick={(e) => { e.stopPropagation(); handleSaveChanges(person.empId); }}>
                                Save
                            </Button>
                        </td>
                      </tr>
                      {expandedRow === person.empId && (
                        <tr className="expanded-row">
                          <td colSpan="14">
                            <div className="expanded-content">
                              <div className="details-section">
                                <h6>Bench Manager Remarks</h6>
                                <ul>{person.remarks && person.remarks.length > 0 ? person.remarks.map((remark, index) => (<li key={`remark-${index}`}>{remark.date} - {remark.text}</li>)) : <li>No remarks found.</li>}</ul>
                                <Form.Group className="mt-3"><Form.Control as="textarea" rows={2} placeholder="Add a new remark..." value={newRemarks[person.empId] || ''} onChange={(e) => handleRemarkChange(person.empId, e.target.value)} /></Form.Group>
                                <Button variant="primary" size="sm" className="mt-2" onClick={() => handleAddRemark(person.empId)}>Add Remark</Button>
                              </div>
                              <div className="details-section">
                                <h6>Trainer's Feedback</h6>
                                <ul>{person.trainerFeedback && person.trainerFeedback.length > 0 ? person.trainerFeedback.map((fb, index) => (<li key={`feedback-${index}`}>{fb.date} - <strong>{fb.trainer}</strong> - {fb.feedback}</li>)) : <li>No feedback found.</li>}</ul>
                              </div>
                              <div className="details-section">
                                <h6>Detailed Assessments</h6>
                                <ul className="assessment-list">{person.assessments ? Object.entries(person.assessments).map(([topic, score]) => (<li key={topic}><span>{topic}</span>{score !== null ? (<span className="score-value">{score}%</span>) : (<span className="score-value not-attempted">Not Attempted</span>)}</li>)) : <li>No assessment data available.</li>}</ul>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )})}
              </tbody>
            </Table>
          )}
        </Container>
      </div>
    </div>
  );
}

export default BenchHomepage;
