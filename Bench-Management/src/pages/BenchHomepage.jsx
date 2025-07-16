import React, { useState, useEffect, useMemo } from "react";
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
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import "./BenchHomepage.css";
import { fetchBenchDetails, updateCandidate } from "../services/benchService";
import { fetchFeedbackbyId } from "../services/feedbackService";
import FeedbackCard from "../components/FeedBackCard";

// --- Helper functions (Unchanged) ---
const displayNA = (value) => (value === null || value === undefined || value === '') ? 'NA' : value;
const calculateAssessment = (assessments) => {
    if (!assessments || typeof assessments !== 'object') { return { average: 0, complete: false }; }
    const scores = Object.values(assessments);
    const validScores = scores.filter(score => score !== null && score !== undefined);
    const complete = validScores.length > 0 && validScores.length === scores.length;
    const average = validScores.length > 0 ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : 0;
    return { average, complete };
};

function BenchHomepage() {
  // All state variables remain the same
  const [benchData, setBenchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "agingDays", direction: "desc" });
  const [filterDeployable, setFilterDeployable] = useState(false);
  const [filterLevels, setFilterLevels] = useState([]);
  const [filterLocations, setFilterLocations] = useState([]);
  const [filterSkills, setFilterSkills] = useState([]);
  const [filterStatuses, setFilterStatuses] = useState([]);
  const [filterBlockedBy, setFilterBlockedBy] = useState([]);
  const [filterSponsorNames, setFilterSponsorNames] = useState([]);
  const [filterAgingCategories, setFilterAgingCategories] = useState([]);
  const [filterYoe, setFilterYoe] = useState([]);

  // Data fetching and dynamic filter options logic remains the same
  useEffect(() => {
    const loadBenchData = async () => {
      try {
        setLoading(true);
        const apiData = await fetchBenchDetails();
        const mappedData = apiData.map(emp => ({
          ...emp,
          status: emp.personStatus,
          yearsOfExperience: emp.experience,
          currentLocation: emp.baseLocation,
          trainerFeedbacks: null,
          interviewFeedbacks: null,
          isFeedbackLoading: false,
          feedbackError: null,
          assessments: {},
        }));
        setBenchData(mappedData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch bench details:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadBenchData();
  }, []);

  const uniqueLevels = useMemo(() => [...new Set(benchData.map(emp => emp.level).filter(Boolean))].sort(), [benchData]);
  const uniqueLocations = useMemo(() => [...new Set(benchData.map(emp => emp.currentLocation).filter(Boolean))].sort(), [benchData]);
  const uniqueSkills = useMemo(() => [...new Set(benchData.map(emp => emp.primarySkill).filter(Boolean))].sort(), [benchData]);
  const uniqueStatuses = useMemo(() => [...new Set(benchData.map(emp => emp.status).filter(Boolean))].sort(), [benchData]);
  const uniqueBlockedByOptions = useMemo(() => [...new Set(benchData.map(emp => emp.blockedBy).filter(Boolean))].sort(), [benchData]);
  const uniqueSponsorNames = useMemo(() => [...new Set(benchData.map(emp => emp.sponsorName).filter(Boolean))].sort(), [benchData]);
  const uniqueAgingCategories = useMemo(() => [...new Set(benchData.map(emp => emp.ageingCategory).filter(Boolean))].sort(), [benchData]);
  const yoeRanges = ["0-2", "3-5", "6-8", "9+"];

  // All handlers (handleRowClick, handleSaveChanges, etc.) remain the same
  const handleRowClick = async (empId) => {
    const person = benchData.find(p => p.empId === empId);
    if (expandedRow === empId) {
      setExpandedRow(null);
      return;
    }
    setExpandedRow(empId);
    if (person && person.trainerFeedbacks === null) {
      try {
        setBenchData(prev => prev.map(p => p.empId === empId ? { ...p, isFeedbackLoading: true } : p));
        const feedbackData = await fetchFeedbackbyId(empId);
        setBenchData(prev => prev.map(p => p.empId === empId ? {
          ...p,
          trainerFeedbacks: feedbackData.trainerFeedbacks || [],
          interviewFeedbacks: feedbackData.interviewFeedbacks || [],
          isFeedbackLoading: false,
        } : p));
      } catch (error) {
        console.error(`Failed to fetch feedback for empId ${empId}:`, error);
        setBenchData(prev => prev.map(p => p.empId === empId ? {
          ...p,
          isFeedbackLoading: false,
          feedbackError: "Could not load feedback."
        } : p));
      }
    }
  };

  const handleFieldChange = (empId, field, value) => {
    setEditedData(prev => ({ ...prev, [empId]: { ...prev[empId], [field]: value } }));
  };

  const handleSaveChanges = async (empId) => {
    const edits = { ...editedData[empId] };
    if (!edits) return;

    if (edits.remarks !== undefined) {
      const today = new Date().toISOString().split('T')[0];
      const remarkTextOnly = edits.remarks.replace(/^\d{4}-\d{2}-\d{2}:\s*/, '');
      if (remarkTextOnly.trim() !== '') {
          edits.remarks = `${today}: ${remarkTextOnly}`;
      } else {
          edits.remarks = ''; 
      }
    }

    const updateDTO = {};
    if (edits.yearsOfExperience !== undefined) updateDTO.experience = edits.yearsOfExperience;
    if (edits.isDeployable !== undefined) updateDTO.isDeployable = edits.isDeployable;
    if (edits.status !== undefined) updateDTO.personStatus = edits.status;
    if (edits.blockedBy !== undefined) updateDTO.blockedBy = edits.blockedBy;
    if (edits.sponsorName !== undefined) updateDTO.sponsorName = edits.sponsorName;
    if (edits.remarks !== undefined) updateDTO.remarks = edits.remarks;

    if (Object.keys(updateDTO).length === 0) return;

    try {
      await updateCandidate(empId, updateDTO);
      setBenchData(prevData => prevData.map(person => person.empId === empId ? { ...person, ...edits } : person));
      setEditedData(prev => {
        const newEditedData = { ...prev };
        delete newEditedData[empId];
        return newEditedData;
      });
    } catch (err) {
      console.error(`Failed to update candidate with ID ${empId}:`, err.response?.data || err.message);
      alert(`Update failed for employee ${empId}. Please check the console for details.`);
    }
  };
  
  const handleMultiSelectChange = (setter, value) => {
    setter((prev) => prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]);
  };
  
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({ key, direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc' }));
  };
  const clearFilters = () => {
    setSearchTerm(""); setFilterDeployable(false); setFilterLevels([]); setFilterLocations([]); setFilterSkills([]); setFilterStatuses([]); setFilterYoe([]);
    setFilterBlockedBy([]); setFilterSponsorNames([]); setFilterAgingCategories([]);
  };
  
  const filteredAndSortedData = useMemo(() => {
    // This memoized function remains unchanged
    let sortableItems = [...benchData];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems.filter((person) => {
        const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) || person.empId.toString().includes(searchTerm);
        const matchesDeployable = !filterDeployable || person.isDeployable;
        const matchesLevel = filterLevels.length === 0 || filterLevels.includes(person.level);
        const matchesLocation = filterLocations.length === 0 || filterLocations.includes(person.currentLocation);
        const matchesSkill = filterSkills.length === 0 || filterSkills.includes(person.primarySkill);
        const matchesStatus = filterStatuses.length === 0 || filterStatuses.includes(person.status);
        const matchesBlockedBy = filterBlockedBy.length === 0 || filterBlockedBy.includes(person.blockedBy);
        const matchesSponsor = filterSponsorNames.length === 0 || filterSponsorNames.includes(person.sponsorName);
        const matchesAgingCategory = filterAgingCategories.length === 0 || filterAgingCategories.includes(person.ageingCategory);
        const matchesYoe = filterYoe.length === 0 || filterYoe.some(range => {
          const exp = person.yearsOfExperience;
          if (exp === null) return false;
          if (range.includes('+')) { const min = parseInt(range, 10); return exp >= min; }
          const [min, max] = range.split('-').map(Number); return exp >= min && exp <= max;
        });
        return matchesSearch && matchesDeployable && matchesLevel && matchesLocation && matchesSkill && matchesStatus && matchesYoe && matchesBlockedBy && matchesSponsor && matchesAgingCategory;
      });
  }, [benchData, searchTerm, filterDeployable, sortConfig, filterLevels, filterLocations, filterSkills, filterStatuses, filterYoe, filterBlockedBy, filterSponsorNames, filterAgingCategories]);

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <FontAwesomeIcon icon={faSortDown} className="sort-icon" />;
    return sortConfig.direction === 'asc' ? <FontAwesomeIcon icon={faSortUp} className="sort-icon active" /> : <FontAwesomeIcon icon={faSortDown} className="sort-icon active" />;
  };

  return (
    <div className={`bench-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* --- Sidebar and Main Table structure are unchanged --- */}
      <div className="filter-sidebar">
        <div className="sidebar-header">
           <h4 className="sidebar-title"><FontAwesomeIcon icon={faFilter} className="me-2" /> Filters</h4>
           <Button variant="light" onClick={() => setSidebarCollapsed(!isSidebarCollapsed)} className="collapse-btn"> <FontAwesomeIcon icon={faFilter} /> </Button>
         </div>
        <div className="sidebar-content">
          <Form.Group className="filter-group" controlId="searchFilter"><Form.Label>Search</Form.Label><Form.Control type="text" placeholder="Name or Emp ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></Form.Group>
          <Form.Group className="filter-group" controlId="statusFilter"><Form.Label>Status</Form.Label><div className="bubble-container">{uniqueStatuses.map((status) => (<button key={status} className={`filter-bubble ${filterStatuses.includes(status) ? 'selected' : ''}`} onClick={() => handleMultiSelectChange(setFilterStatuses, status)}>{status}</button>))}</div></Form.Group>
          <Form.Group className="filter-group" controlId="blockedByFilter"><Form.Label>Blocked By</Form.Label><div className="bubble-container">{uniqueBlockedByOptions.map((owner) => (<button key={owner} className={`filter-bubble ${filterBlockedBy.includes(owner) ? 'selected' : ''}`} onClick={() => handleMultiSelectChange(setFilterBlockedBy, owner)}>{owner}</button>))}</div></Form.Group>
          <Form.Group className="filter-group" controlId="sponsorFilter"><Form.Label>Sponsor Name</Form.Label><div className="bubble-container">{uniqueSponsorNames.map((name) => (<button key={name} className={`filter-bubble ${filterSponsorNames.includes(name) ? 'selected' : ''}`} onClick={() => handleMultiSelectChange(setFilterSponsorNames, name)}>{name}</button>))}</div></Form.Group>
          <Form.Group className="filter-group" controlId="agingCategoryFilter"><Form.Label>Aging Category</Form.Label><div className="bubble-container">{uniqueAgingCategories.map((cat) => (<button key={cat} className={`filter-bubble ${filterAgingCategories.includes(cat) ? 'selected' : ''}`} onClick={() => handleMultiSelectChange(setFilterAgingCategories, cat)}>{cat}</button>))}</div></Form.Group>
          <Form.Group className="filter-group" controlId="yoeFilter"><Form.Label>Years of Experience</Form.Label><div className="bubble-container">{yoeRanges.map((range) => (<button key={range} className={`filter-bubble ${filterYoe.includes(range) ? 'selected' : ''}`} onClick={() => handleMultiSelectChange(setFilterYoe, range)}>{range}</button>))}</div></Form.Group>
          <Form.Group className="filter-group" controlId="levelFilter"><Form.Label>Level</Form.Label><div className="bubble-container">{uniqueLevels.map((level) => (<button key={level} className={`filter-bubble ${filterLevels.includes(level) ? 'selected' : ''}`} onClick={() => handleMultiSelectChange(setFilterLevels, level)}>{level}</button>))}</div></Form.Group>
          <Form.Group className="filter-group" controlId="skillFilter"><Form.Label>Primary Skill</Form.Label><div className="bubble-container">{uniqueSkills.map((skill) => (<button key={skill} className={`filter-bubble ${filterSkills.includes(skill) ? 'selected' : ''}`} onClick={() => handleMultiSelectChange(setFilterSkills, skill)}>{skill}</button>))}</div></Form.Group>
          <Form.Group className="filter-group" controlId="locationFilter"><Form.Label>Base Location</Form.Label><div className="bubble-container">{uniqueLocations.map((loc) => (<button key={loc} className={`filter-bubble ${filterLocations.includes(loc) ? 'selected' : ''}`} onClick={() => handleMultiSelectChange(setFilterLocations, loc)}>{loc}</button>))}</div></Form.Group>
          <Form.Group className="filter-group" controlId="deployableFilter"><Form.Check type="switch" id="deployable-switch" label="Only Deployable" checked={filterDeployable} onChange={(e) => setFilterDeployable(e.target.checked)} /></Form.Group>
          <Button variant="outline-secondary" size="sm" className="w-100 mt-4" onClick={clearFilters}>Clear All Filters</Button>
        </div>
      </div>
      <div className="main-content">
        <Container fluid>
          <h2 className="mb-4">Bench Dashboard</h2>
          {loading ? ( <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div> ) 
          : error ? ( <Alert variant="danger">{error}</Alert> ) 
          : (
            <Table bordered hover responsive className="bench-table shadow-sm align-middle">
              <thead>
                <tr>
                  <th className="sortable-header" onClick={() => handleSort('empId')}>Emp ID</th>
                  <th className="sortable-header" onClick={() => handleSort('name')}>Name</th>
                  <th className="sortable-header" onClick={() => handleSort('primarySkill')}>Primary Skill</th>
                  <th className="sortable-header" onClick={() => handleSort('level')}>Level</th>
                  <th className="sortable-header" onClick={() => handleSort('yearsOfExperience')}>Yrs of Exp</th>
                  <th className="sortable-header" onClick={() => handleSort('sponsorName')}>Sponsor Name</th>
                  <th className="sortable-header" onClick={() => handleSort('agingDays')}>Aging</th>
                  <th className="sortable-header" onClick={() => handleSort('ageingCategory')}>Aging Category</th>
                  <th>Deployable</th>
                  <th className="sortable-header" onClick={() => handleSort('blockedBy')}>Blocked By</th>
                  <th className="sortable-header" onClick={() => handleSort('status')}>Status</th>
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
                        <td>{displayNA(person.empId)}</td>
                        <td><Link to={`/dashboard/${person.empId}`} className="employee-link" onClick={(e) => e.stopPropagation()}>{displayNA(person.name)}</Link></td>
                        <td>{displayNA(person.primarySkill)}</td>
                        <td>{displayNA(person.level)}</td>
                        <td><Form.Control type="number" step="0.1" size="sm" className="editable-field" value={displayNA(currentPersonData.yearsOfExperience)} onChange={(e) => handleFieldChange(person.empId, 'yearsOfExperience', Number(e.target.value))} onClick={(e) => e.stopPropagation()} /></td>
                        <td><Form.Control type="text" size="sm" className="editable-field" value={displayNA(currentPersonData.sponsorName)} onChange={(e) => handleFieldChange(person.empId, 'sponsorName', e.target.value)} onClick={(e) => e.stopPropagation()} /></td>
                        <td><OverlayTrigger placement="top" overlay={<Tooltip>Dept: {displayNA(person.departmentName)}<br />Bench: {displayNA(person.benchStartDate)} to {displayNA(person.benchEndDate) || 'Present'}</Tooltip>}><span className="aging-tooltip">{displayNA(person.agingDays)} days</span></OverlayTrigger></td>
                        <td>{displayNA(person.ageingCategory)}</td>
                        <td className="text-center"><Form.Check type="switch" id={`deployable-${person.empId}`} checked={!!currentPersonData.isDeployable} onChange={(e) => handleFieldChange(person.empId, 'isDeployable', e.target.checked)} onClick={(e) => e.stopPropagation()} /></td>
                        <td><Form.Control type="text" size="sm" className="editable-field" value={displayNA(currentPersonData.blockedBy)} onChange={(e) => handleFieldChange(person.empId, 'blockedBy', e.target.value)} onClick={(e) => e.stopPropagation()} /></td>
                        <td><Form.Select size="sm" className="editable-field" value={displayNA(currentPersonData.status)} onChange={(e) => handleFieldChange(person.empId, 'status', e.target.value)} onClick={(e) => e.stopPropagation()}>{uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}</Form.Select></td>
                        <td><span className={complete ? 'assessment-complete' : 'assessment-incomplete'}>{average}%</span></td>
                        <td><a href={person.thLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>Link</a></td>
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
                              {/* Remarks Section */}
                              <div className="details-section">
                                <h6>Bench Manager Remarks</h6>
                                <Form.Group>
                                  <Form.Control as="textarea" rows={3} className="remarks-textarea" placeholder="No remarks found. Enter remarks to save." value={displayNA(editedData[person.empId]?.remarks !== undefined ? editedData[person.empId].remarks : person.remarks)} onChange={(e) => handleFieldChange(person.empId, 'remarks', e.target.value)} />
                                </Form.Group>
                              </div>
                              {/* --- UPDATED FEEDBACK UI --- */}
                              <div className="details-section">
                                <h6>Interview Feedback</h6>
                                {person.isFeedbackLoading ? (
                                  <div className="text-center p-3"><Spinner animation="border" size="sm" /></div>
                                ) : person.feedbackError ? (
                                  <Alert variant="danger" size="sm">{person.feedbackError}</Alert>
                                ) : (
                                  <ul className="list-unstyled">
                                    {person.interviewFeedbacks && person.interviewFeedbacks.length > 0
                                      ? person.interviewFeedbacks.map((fb, i) => <li key={`interview-fb-${i}`}><FeedbackCard feedbackString={fb} /></li>)
                                      : <li>No interview feedback found.</li>}
                                  </ul>
                                )}
                              </div>
                              <div className="details-section">
                                <h6>Trainer's Feedback</h6>
                                {person.isFeedbackLoading ? (
                                    <div className="text-center p-3"><Spinner animation="border" size="sm" /></div>
                                ) : person.feedbackError ? (
                                    null /* Error shown in the first feedback section */
                                ) : (
                                    <ul className="list-unstyled">
                                      {person.trainerFeedbacks && person.trainerFeedbacks.length > 0
                                        ? person.trainerFeedbacks.map((fb, i) => <li key={`trainer-fb-${i}`}><FeedbackCard feedbackString={fb} /></li>)
                                        : <li>No trainer feedback found.</li>}
                                    </ul>
                                )}
                              </div>
                              {/* --- END UPDATED FEEDBACK UI --- */}
                              <div className="details-section">
                                <h6>Detailed Assessments</h6>
                                <ul className="assessment-list">
                                    {Object.keys(person.assessments).length > 0 ? Object.entries(person.assessments).map(([topic, score]) => (<li key={topic}><span>{topic}</span>{score !== null ? (<span className="score-value">{score}%</span>) : (<span className="score-value not-attempted">Not Attempted</span>)}</li>)) : <li>No assessment data available.</li>}
                                </ul>
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