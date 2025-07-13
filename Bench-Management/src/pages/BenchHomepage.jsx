import React, { useState, useMemo, useEffect } from "react";
import {
  Container,
  Table,
  Form,
  Spinner,
  Button,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "./BenchHomepage.css";

import { fetchBenchDetails } from "../services/benchService";

// ✅ Real hook using your backend API
function useBenchData() {
  const [benchData, setBenchData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchBenchDetails();
        setBenchData(data); // use `data.data` if needed
      } catch (error) {
        console.error("Error loading bench data:", error);
        setBenchData([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return { benchData, loading };
}

function BenchHomepage() {
  const { benchData, loading } = useBenchData();

  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [filterDeployable, setFilterDeployable] = useState(false);
  const [filterLevels, setFilterLevels] = useState([]);
  const [filterLocations, setFilterLocations] = useState([]);
  const [filterSkills, setFilterSkills] = useState([]);

  const uniqueLevels = [...new Set(benchData.map((emp) => emp.level))].sort();
  const uniqueLocations = [...new Set(benchData.map((emp) => emp.location))].sort();
  const uniqueSkills = [...new Set(benchData.map((emp) => emp.primarySkill))].sort();

  const handleMultiSelectChange = (setter, value) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterDeployable(false);
    setFilterLevels([]);
    setFilterLocations([]);
    setFilterSkills([]);
  };

  const filteredData = useMemo(() => {
    return benchData
      .filter((person) => {
        const matchesSearch =
          person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          person.empId.toString().includes(searchTerm);
        const matchesDeployable = !filterDeployable || person.isDeployable;
        const matchesLevel =
          filterLevels.length === 0 || filterLevels.includes(person.level);
        const matchesLocation =
          filterLocations.length === 0 || filterLocations.includes(person.location);
        const matchesSkill =
          filterSkills.length === 0 || filterSkills.includes(person.primarySkill);

        return (
          matchesSearch &&
          matchesDeployable &&
          matchesLevel &&
          matchesLocation &&
          matchesSkill
        );
      })
      .sort((a, b) => (sortAsc ? a.agingDays - b.agingDays : b.agingDays - a.agingDays));
  }, [benchData, searchTerm, filterDeployable, sortAsc, filterLevels, filterLocations, filterSkills]);

  return (
    <div className={`bench-layout ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      {/* --- Sidebar --- */}
      <div className="filter-sidebar">
        <div className="sidebar-header">
          <h4 className="sidebar-title">Filters</h4>
          <Button
            variant="light"
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            className="collapse-btn"
          >
            {isSidebarCollapsed ? "»" : "«"}
          </Button>
        </div>

        <div className="sidebar-content">
          <Form.Group className="filter-group" controlId="searchFilter">
            <Form.Label>Search</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name or Emp ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="filter-group" controlId="levelFilter">
            <Form.Label>Level</Form.Label>
            <div className="bubble-container">
              {uniqueLevels.map((level) => (
                <button
                  key={level}
                  className={`filter-bubble ${
                    filterLevels.includes(level) ? "selected" : ""
                  }`}
                  onClick={() => handleMultiSelectChange(setFilterLevels, level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </Form.Group>

          <Form.Group className="filter-group" controlId="skillFilter">
            <Form.Label>Primary Skill</Form.Label>
            <div className="bubble-container">
              {uniqueSkills.map((skill) => (
                <button
                  key={skill}
                  className={`filter-bubble ${
                    filterSkills.includes(skill) ? "selected" : ""
                  }`}
                  onClick={() => handleMultiSelectChange(setFilterSkills, skill)}
                >
                  {skill}
                </button>
              ))}
            </div>
          </Form.Group>

          <Form.Group className="filter-group" controlId="locationFilter">
            <Form.Label>Location</Form.Label>
            <div className="bubble-container">
              {uniqueLocations.map((loc) => (
                <button
                  key={loc}
                  className={`filter-bubble ${
                    filterLocations.includes(loc) ? "selected" : ""
                  }`}
                  onClick={() => handleMultiSelectChange(setFilterLocations, loc)}
                >
                  {loc}
                </button>
              ))}
            </div>
          </Form.Group>

          <Form.Group className="filter-group" controlId="deployableFilter">
            <Form.Check
              type="switch"
              id="deployable-switch"
              label="Only Deployable"
              checked={filterDeployable}
              onChange={(e) => setFilterDeployable(e.target.checked)}
            />
          </Form.Group>

          <Button variant="outline-secondary" size="sm" className="w-100 mt-4" onClick={clearFilters}>
            Clear All Filters
          </Button>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="main-content">
        <Container fluid>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="mb-0">Bench Dashboard</h2>
            <Button variant="light" onClick={() => setSortAsc((prev) => !prev)}>
              Sort Aging {sortAsc ? "↑" : "↓"}
            </Button>
          </div>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Table bordered hover responsive className="bench-table shadow-sm align-middle">
              <thead>
                <tr>
                  <th>Emp ID</th>
                  <th>Name</th>
                  <th>Primary Skill</th>
                  <th>Level</th>
                  <th>Location</th>
                  <th>Aging</th>
                  <th>Deployable</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((person) => (
                    <tr key={person.empId}>
                      <td>{person.empId}</td>
                      <td>
                        <Link to={`/dashboard/${person.empId}`} className="employee-link">
                          {person.name}
                        </Link>
                      </td>
                      <td>{person.primarySkill}</td>
                      <td>{person.level}</td>
                      <td>{person.location}</td>
                      <td>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip>
                              Dept: {person.departmentName}
                              <br />
                              Bench: {person.benchStartDate} to {person.benchEndDate}
                            </Tooltip>
                          }
                        >
                          <span className="aging-tooltip">{person.agingDays} days</span>
                        </OverlayTrigger>
                      </td>
                      <td>
                        <span
                          className={`deploy-badge ${
                            person.isDeployable ? "text-deployable" : "text-not-deployable"
                          }`}
                        >
                          {person.isDeployable ? "Yes" : "No"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center p-4">
                      No employees match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Container>
      </div>
    </div>
  );
}

export default BenchHomepage;
