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
  InputGroup,
  ListGroup
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSortUp, faSortDown, faTrash, faPlus, faExternalLinkAlt, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import "./BenchHomepage.css";
import { fetchBenchDetails, updateCandidate, createRemarkForCandidate, deleteRemark } from "../services/benchService";
import { fetchAssessmentByEmpId } from "../services/analyticsService";
import { fetchFeedbackbyId } from "../services/feedbackService";
// ✨ 1. ADD THE NEW IMPORT FOR MENTOR FEEDBACK
import { getFeedbacksByCandidate } from "../services/mentorService";
import FeedbackCard from "../components/FeedBackCard";
import AddInterviewFeedbackModal from "../components/AddInterviewFeedbackModal";

// Helper function
const displayNA = (value) => (value === null || value === undefined || value === '') ? 'NA' : value;

// Helper component to render the assessment tooltip
const renderAssessmentTooltip = (assessments) => (
  <Tooltip id="assessment-tooltip">
    <div className="assessment-tooltip-content">
      <h6 className="mb-2">Detailed Scores</h6>
      {Object.keys(assessments).length > 0 ? (
        <ul className="list-unstyled mb-0">
          {Object.entries(assessments).map(([topic, score]) => (
            <li key={topic} className="d-flex justify-content-between">
              <span>{topic}:</span>
              {score !== null ? (
                <span className="fw-bold ms-3">{score}%</span>
              ) : (
                <span className="fw-bold ms-3 text-danger">N/A</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        "No detailed scores available."
      )}
    </div>
  </Tooltip>
);


function BenchHomepage() {
  // --- State ---
  const [benchData, setBenchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [newRemarkInputs, setNewRemarkInputs] = useState({});
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "agingDays", direction: "desc" });
  const [filterDeployable, setFilterDeployable] = useState(false);
  const [filterLevels, setFilterLevels] = useState([]);
  const [filterLocations, setFilterLocations] = useState([]);
  const [filterSkills, setFilterSkills] = useState([]);
  const [filterStatuses, setFilterStatuses] = useState([]);
  const [filterBlockedBy, setFilterBlockedBy] = useState([]);
  const [filterAgingCategories, setFilterAgingCategories] = useState([]);
  const [filterYoe, setFilterYoe] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        const apiData = await fetchBenchDetails();
        if (!apiData || apiData.length === 0) {
          setBenchData([]);
          setLoading(false);
          return;
        }

        const assessmentPromises = apiData.map(emp =>
          fetchAssessmentByEmpId(emp.empId).catch(err => {
            console.warn(`Could not fetch assessment for empId ${emp.empId}:`, err);
            return null;
          })
        );
        const assessmentResults = await Promise.all(assessmentPromises);

        const mappedData = apiData.map((emp, index) => {
          const assessmentData = assessmentResults[index];
          let detailedScores = {};
          if (assessmentData?.perTopicScores) {
            assessmentData.perTopicScores.forEach(topicScore => {
              const percentage = Math.round((topicScore.empScore / topicScore.totalScore) * 100);
              detailedScores[topicScore.topic] = isNaN(percentage) ? 0 : percentage;
            });
          }
          if (assessmentData?.completionStatus?.pendingTopics) {
            assessmentData.completionStatus.pendingTopics.forEach(topic => {
              detailedScores[topic] = null;
            });
          }

          return {
            ...emp,
            status: emp.personStatus,
            yearsOfExperience: emp.experience,
            currentLocation: emp.baseLocation,
            remarks: emp.remarks || [],
            trainerFeedbacks: null, // This will hold mentor feedback
            interviewFeedbacks: null, // This will hold client feedback
            isFeedbackLoading: false,
            feedbackError: null,
            assessments: detailedScores,
            averageMarks: assessmentData?.averagePercentage,
            hasPendingAssessments: (assessmentData?.completionStatus?.pending || 0) > 0,
          };
        });

        setBenchData(mappedData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, []);

  // --- Filter and Sort Logic ---
  const uniqueLevels = useMemo(() => [...new Set(benchData.map(emp => emp.level).filter(Boolean))].sort(), [benchData]);
  const uniqueLocations = useMemo(() => [...new Set(benchData.map(emp => emp.currentLocation).filter(Boolean))].sort(), [benchData]);
  const uniqueSkills = useMemo(() => [...new Set(benchData.map(emp => emp.primarySkill).filter(Boolean))].sort(), [benchData]);
  const uniqueStatuses = useMemo(() => [...new Set(benchData.map(emp => emp.status).filter(Boolean))].sort(), [benchData]);
  const uniqueBlockedByOptions = useMemo(() => [...new Set(benchData.map(emp => emp.blockedBy).filter(Boolean))].sort(), [benchData]);
  const uniqueAgingCategories = useMemo(() => [...new Set(benchData.map(emp => emp.ageingCategory).filter(Boolean))].sort(), [benchData]);
  const yoeRanges = ["0-2", "3-5", "6-8", "9+"];

  // --- Handlers ---
  const handleFeedbackAdded = async (empId) => {
    try {
      const feedbackData = await fetchFeedbackbyId(empId);
      setBenchData(prev => 
        prev.map(p => 
          p.empId === empId 
            ? { ...p, interviewFeedbacks: feedbackData.interviewFeedbacks || [] } 
            : p
        )
      );
      setShowFeedbackModal(false);
      setSelectedEmployee(null);
    } catch (error) {
      console.error(`Failed to refresh feedback for empId ${empId}:`, error);
      alert('Feedback was added, but the view could not be refreshed automatically.');
    }
  };

  // ✨ 2. UPDATE handleRowClick TO FETCH BOTH CLIENT AND MENTOR FEEDBACK
  const handleRowClick = async (empId) => {
    const person = benchData.find(p => p.empId === empId);
    if (expandedRow === empId) {
      setExpandedRow(null);
      return;
    }
    setExpandedRow(empId);
    
    // Fetch data only if it hasn't been fetched before
    if (person && person.trainerFeedbacks === null) {
      try {
        setBenchData(prev => prev.map(p => p.empId === empId ? { ...p, isFeedbackLoading: true } : p));
        
        // Fetch client and mentor feedback concurrently
        const [clientFeedbackData, mentorFeedbackData] = await Promise.all([
            fetchFeedbackbyId(empId),
            getFeedbacksByCandidate(empId)
        ]);

        setBenchData(prev => prev.map(p => p.empId === empId ? { 
            ...p, 
            trainerFeedbacks: mentorFeedbackData || [], // Store mentor feedback here
            interviewFeedbacks: clientFeedbackData.interviewFeedbacks || [], 
            isFeedbackLoading: false 
        } : p));

      } catch (error) {
        console.error(`Failed to fetch feedback for empId ${empId}:`, error);
        setBenchData(prev => prev.map(p => p.empId === empId ? { ...p, isFeedbackLoading: false, feedbackError: "Could not load feedback." } : p));
      }
    }
  };

  const handleFieldChange = (empId, field, value) => {
    setEditedData(prev => ({ ...prev, [empId]: { ...prev[empId], [field]: value } }));
  };

  const handleSaveChanges = async (empId) => {
    const edits = editedData[empId];
    if (!edits) return;

    const updateDTO = {};
    if (edits.yearsOfExperience !== undefined) updateDTO.experience = edits.yearsOfExperience;
    if (edits.isDeployable !== undefined) updateDTO.isDeployable = edits.isDeployable;
    if (edits.status !== undefined) updateDTO.personStatus = edits.status;
    if (edits.blockedBy !== undefined) updateDTO.blockedBy = edits.blockedBy;
    if (edits.sponsorName !== undefined) updateDTO.sponsorName = edits.sponsorName;

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
      alert(`Update failed for employee ${empId}. Please check the console for details.`);
    }
  };

  const handleAddRemark = async (empId) => {
    const remarkText = newRemarkInputs[empId]?.trim();
    if (!remarkText) return;

    try {
      const newRemark = await createRemarkForCandidate(empId, remarkText);
      setBenchData(prevBenchData =>
        prevBenchData.map(person => {
          if (person.empId === empId) {
            return { ...person, remarks: [newRemark, ...person.remarks] };
          }
          return person;
        })
      );
      setNewRemarkInputs(prev => ({ ...prev, [empId]: '' }));
    } catch (error) {
      alert("Failed to add remark. Please try again.");
    }
  };

  const handleDeleteRemark = async (empId, remarkId) => {
    if (!window.confirm("Are you sure you want to delete this remark?")) return;

    try {
      await deleteRemark(remarkId);
      setBenchData(prevBenchData =>
        prevBenchData.map(person => {
          if (person.empId === empId) {
            return { ...person, remarks: person.remarks.filter(r => r.id !== remarkId) };
          }
          return person;
        })
      );
    } catch (error) {
      alert("Failed to delete remark. Please try again.");
    }
  };

  const handleMultiSelectChange = (setter, value) => setter(prev => prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]);
  const handleSort = (key) => setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));

  const clearFilters = () => { setSearchTerm(""); setFilterDeployable(false); setFilterLevels([]); setFilterLocations([]); setFilterSkills([]); setFilterStatuses([]); setFilterYoe([]); setFilterBlockedBy([]); setFilterAgingCategories([]); };

  const filteredAndSortedData = useMemo(() => {
    let sortableItems = [...benchData];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key]; const bValue = b[sortConfig.key];
        if (aValue === null || aValue === undefined) return 1; if (bValue === null || bValue === undefined) return -1;
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1; if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems.filter(person => {
      const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) || person.empId.toString().includes(searchTerm);
      const matchesDeployable = !filterDeployable || person.isDeployable;
      const matchesLevel = filterLevels.length === 0 || filterLevels.includes(person.level);
      const matchesLocation = filterLocations.length === 0 || filterLocations.includes(person.currentLocation);
      const matchesSkill = filterSkills.length === 0 || filterSkills.includes(person.primarySkill);
      const matchesStatus = filterStatuses.length === 0 || filterStatuses.includes(person.status);
      const matchesBlockedBy = filterBlockedBy.length === 0 || filterBlockedBy.includes(person.blockedBy);
      const matchesAgingCategory = filterAgingCategories.length === 0 || filterAgingCategories.includes(person.ageingCategory);
      const matchesYoe = filterYoe.length === 0 || filterYoe.some(range => {
        const exp = person.yearsOfExperience; if (exp === null) return false;
        if (range.includes('+')) return exp >= parseInt(range, 10);
        const [min, max] = range.split('-').map(Number); return exp >= min && exp <= max;
      });
      return matchesSearch && matchesDeployable && matchesLevel && matchesLocation && matchesSkill && matchesStatus && matchesYoe && matchesBlockedBy && matchesAgingCategory;
    });
  }, [benchData, searchTerm, filterDeployable, sortConfig, filterLevels, filterLocations, filterSkills, filterStatuses, filterYoe, filterBlockedBy, filterAgingCategories]);

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <FontAwesomeIcon icon={faSortDown} className="sort-icon" />;
    return sortConfig.direction === 'asc' ? <FontAwesomeIcon icon={faSortUp} className="sort-icon active" /> : <FontAwesomeIcon icon={faSortDown} className="sort-icon active" />;
  };

  return (
    <div className={`bench-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="filter-sidebar">
        <div className="sidebar-header">
          <h4 className="sidebar-title"><FontAwesomeIcon icon={faFilter} className="me-2" /> Filters</h4>
          <Button variant="light" onClick={() => setSidebarCollapsed(!isSidebarCollapsed)} className="collapse-btn">
            <FontAwesomeIcon icon={isSidebarCollapsed ? faChevronRight : faChevronLeft} />
          </Button>
        </div>
        <div className="sidebar-content">
          <Form.Group className="filter-group" controlId="searchFilter"><Form.Label>Search</Form.Label><Form.Control type="text" placeholder="Name or Emp ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></Form.Group>
          <Form.Group className="filter-group" controlId="statusFilter"><Form.Label>Status</Form.Label><div className="bubble-container">{uniqueStatuses.map((status) => (<button key={status} className={`filter-bubble ${filterStatuses.includes(status) ? 'selected' : ''}`} onClick={() => handleMultiSelectChange(setFilterStatuses, status)}>{status}</button>))}</div></Form.Group>
          <Form.Group className="filter-group" controlId="blockedByFilter"><Form.Label>Blocked By</Form.Label><div className="bubble-container">{uniqueBlockedByOptions.map((owner) => (<button key={owner} className={`filter-bubble ${filterBlockedBy.includes(owner) ? 'selected' : ''}`} onClick={() => handleMultiSelectChange(setFilterBlockedBy, owner)}>{owner}</button>))}</div></Form.Group>
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
          {loading ? (<div className="text-center p-5"><Spinner animation="border" variant="primary" /> <span className="ms-2">Loading Resources...</span></div>)
            : error ? (<Alert variant="danger">{error}</Alert>)
              : (
                <Table bordered hover responsive className="bench-table shadow-sm align-middle">
                  <thead>
                    <tr>
                      <th className="sortable-header" onClick={() => handleSort('empId')}>Emp ID {renderSortIcon('empId')}</th>
                      <th className="sortable-header" onClick={() => handleSort('name')}>Name {renderSortIcon('name')}</th>
                      <th className="sortable-header" onClick={() => handleSort('primarySkill')}>Primary Skill {renderSortIcon('primarySkill')}</th>
                      <th className="sortable-header" onClick={() => handleSort('level')}>Level {renderSortIcon('level')}</th>
                      <th className="sortable-header" onClick={() => handleSort('yearsOfExperience')}>YoE {renderSortIcon('yearsOfExperience')}</th>
                      <th className="sortable-header" onClick={() => handleSort('accoliteDoj')}>DOJ {renderSortIcon('accoliteDoj')}</th>
                      <th className="sortable-header" onClick={() => handleSort('currentLocation')}>Location {renderSortIcon('currentLocation')}</th>
                      <th className="sortable-header" onClick={() => handleSort('sponsorName')}>Sponsor {renderSortIcon('sponsorName')}</th>
                      <th className="sortable-header" onClick={() => handleSort('agingDays')}>Aging {renderSortIcon('agingDays')}</th>
                      <th className="sortable-header" onClick={() => handleSort('ageingCategory')}>Category {renderSortIcon('ageingCategory')}</th>
                      <th>Deployable</th>
                      <th className="sortable-header" onClick={() => handleSort('blockedBy')}>Blocked By {renderSortIcon('blockedBy')}</th>
                      <th className="sortable-header" onClick={() => handleSort('status')}>Status {renderSortIcon('status')}</th>
                      <th className="sortable-header" onClick={() => handleSort('averageMarks')}>Avg. Score {renderSortIcon('averageMarks')}</th>
                      <th>TH Link</th>
                      <th className="action-column-header">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedData.map((person) => {
                      const currentPersonData = { ...person, ...editedData[person.empId] };
                      return (
                        <React.Fragment key={person.empId}>
                          <tr className="clickable-row" onClick={() => handleRowClick(person.empId)}>
                            <td>{displayNA(person.empId)}</td>
                            <td><Link to={`/dashboard/${person.empId}`} className="employee-link" onClick={e => e.stopPropagation()}>{displayNA(person.name)}</Link></td>
                            <td>{displayNA(person.primarySkill)}</td>
                            <td>{displayNA(person.level)}</td>
                            <td><Form.Control type="number" step="0.1" size="sm" className="editable-field" value={displayNA(currentPersonData.yearsOfExperience)} onChange={e => handleFieldChange(person.empId, 'yearsOfExperience', Number(e.target.value))} onClick={e => e.stopPropagation()} /></td>
                            <td>{displayNA(person.accoliteDoj)}</td>
                            <td>{displayNA(person.currentLocation)}</td>
                            <td><Form.Control type="text" size="sm" className="editable-field" value={displayNA(currentPersonData.sponsorName)} onChange={e => handleFieldChange(person.empId, 'sponsorName', e.target.value)} onClick={e => e.stopPropagation()} /></td>
                            <td><OverlayTrigger placement="top" overlay={<Tooltip>Dept: {displayNA(person.departmentName)}<br />Bench: {displayNA(person.benchStartDate)} to {displayNA(person.benchEndDate) || 'Present'}</Tooltip>}><span className="aging-tooltip">{displayNA(person.agingDays)} days</span></OverlayTrigger></td>
                            <td>{displayNA(person.ageingCategory)}</td>
                            <td className="text-center"><Form.Check type="switch" id={`deployable-${person.empId}`} checked={!!currentPersonData.isDeployable} onChange={e => handleFieldChange(person.empId, 'isDeployable', e.target.checked)} onClick={e => e.stopPropagation()} /></td>
                            <td><Form.Control type="text" size="sm" className="editable-field" value={displayNA(currentPersonData.blockedBy)} onChange={e => handleFieldChange(person.empId, 'blockedBy', e.target.value)} onClick={e => e.stopPropagation()} /></td>
                            <td><Form.Select size="sm" className="editable-field" value={displayNA(currentPersonData.status)} onChange={e => handleFieldChange(person.empId, 'status', e.target.value)} onClick={e => e.stopPropagation()}>{uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}</Form.Select></td>
                            <OverlayTrigger placement="left" overlay={renderAssessmentTooltip(person.assessments)}>
                              <td className="text-center">
                                <span className={person.hasPendingAssessments ? 'text-danger fw-bold' : ''}>
                                  {displayNA(person.averageMarks !== undefined ? `${person.averageMarks}%` : null)}
                                </span>
                              </td>
                            </OverlayTrigger>
                            <td className="text-center">
                              {person.thLink ? (
                                <a href={person.thLink} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} title="View Assessment Report"><FontAwesomeIcon icon={faExternalLinkAlt} /></a>
                              ) : (displayNA(null))}
                            </td>
                            <td className="action-column-cell">
                              <Button variant="success" size="sm" disabled={!editedData[person.empId]} onClick={e => { e.stopPropagation(); handleSaveChanges(person.empId); }}>Save</Button>
                            </td>
                          </tr>
                          {expandedRow === person.empId && (
                            <tr className="expanded-row">
                              <td colSpan="17">
                                <div className="expanded-content">
                                  <div className="details-section">
                                    <h6>Remarks</h6>
                                    <InputGroup className="mb-3">
                                      <Form.Control
                                        placeholder="Add a new remark..."
                                        value={newRemarkInputs[person.empId] || ''}
                                        onChange={e => setNewRemarkInputs(prev => ({ ...prev, [person.empId]: e.target.value }))}
                                      />
                                      <Button variant="outline-primary" onClick={() => handleAddRemark(person.empId)}>
                                        <FontAwesomeIcon icon={faPlus} /> Add
                                      </Button>
                                    </InputGroup>
                                    <div className="feedback-scroll-container">
                                      {person.remarks && person.remarks.length > 0 ? (
                                        person.remarks.map(remark => (
                                          <div key={remark.id} className="remark-item">
                                            <span><strong>{new Date(remark.date).toLocaleDateString()}:</strong> {remark.text}</span>
                                            <Button variant="link" className="text-danger p-0 ms-2" onClick={() => handleDeleteRemark(person.empId, remark.id)}>
                                              <FontAwesomeIcon icon={faTrash} />
                                            </Button>
                                          </div>
                                        ))
                                      ) : (
                                        <p className="text-muted">No remarks found.</p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="details-section">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                      <h6>Client Feedback</h6>
                                      <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedEmployee(person);
                                          setShowFeedbackModal(true);
                                        }}
                                      >
                                        <FontAwesomeIcon icon={faPlus} /> Add Feedback
                                      </Button>
                                    </div>
                                    <div className="feedback-scroll-container">
                                      {person.isFeedbackLoading ? (<div className="text-center p-3"><Spinner animation="border" size="sm" /></div>) : person.feedbackError ? (<Alert variant="danger" size="sm">{person.feedbackError}</Alert>) : (
                                        <ul className="list-unstyled mb-0">
                                          {person.interviewFeedbacks && person.interviewFeedbacks.length > 0 ? person.interviewFeedbacks.map((fb, i) => <li key={`interview-fb-${i}`}><FeedbackCard feedbackString={fb} /></li>) : <li>No client feedback found.</li>}
                                        </ul>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* ✨ 3. UPDATE THE MENTOR'S FEEDBACK SECTION */}
                                  <div className="details-section">
                                    <h6>Mentor's Feedback</h6>
                                    <div className="feedback-scroll-container">
                                      {person.isFeedbackLoading ? (<div className="text-center p-3"><Spinner animation="border" size="sm" /></div>) : person.feedbackError ? (<Alert variant="danger" size="sm">{person.feedbackError}</Alert>) : (
                                        <ul className="list-unstyled mb-0">
                                          {person.trainerFeedbacks && person.trainerFeedbacks.length > 0 ? (
                                            person.trainerFeedbacks.map((fb) => (
                                              <li key={fb.mentor_feedback_id} className="feedback-item-simple">
                                                <span className="feedback-meta-simple"><b>{new Date(fb.date).toLocaleDateString()} - {fb.trainer_name}: </b></span>
                                                <span className="feedback-text-simple">{fb.mentor_feedback}</span>
                                              </li>
                                            ))
                                          ) : (
                                            <li>No mentor feedback found.</li>
                                          )}
                                        </ul>
                                      )}
                                    </div>
                                  </div>

                                  <div className="details-section">
                                    <h6>Detailed Assessments</h6>
                                    <div className="feedback-scroll-container">
                                      <ul className="assessment-list">
                                        {Object.keys(person.assessments).length > 0 ? Object.entries(person.assessments).map(([topic, score]) => (
                                          <li key={topic}><span>{topic}</span>{score !== null ? (<span className="score-value">{score}%</span>) : (<span className="score-value not-attempted text-danger">Not Attempted</span>)}</li>
                                        )) : <li>No assessment data available.</li>}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      )
                    })}
                  </tbody>
                </Table>
              )}
        </Container>
      </div>
      <AddInterviewFeedbackModal
        show={showFeedbackModal}
        onHide={() => setShowFeedbackModal(false)}
        employee={selectedEmployee}
        onSuccess={handleFeedbackAdded}
      />
    </div>
  );
}

export default BenchHomepage;
