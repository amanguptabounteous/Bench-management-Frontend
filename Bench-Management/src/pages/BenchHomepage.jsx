import React, { useEffect, useState, useMemo } from "react";
import {
  Container,
  Table,
  Form,
  Spinner,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { fetchBenchDetails } from "../services/benchService";
import { useNavigate, Link } from "react-router-dom";
import "./BenchHomepage.css";

function BenchHomepage() {
  const [benchData, setBenchData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortAsc, setSortAsc] = useState(true);
  const [filterDeployable, setFilterDeployable] = useState(false);
  const [filterLevel, setFilterLevel] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterSkill, setFilterSkill] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    } else {
      fetchBenchDetails()
        .then((data) => {
          setBenchData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching bench data:", error);
          setLoading(false);
          if (error.message.includes("401")) {
            localStorage.removeItem("token");
            navigate("/signin");
          }
        });
    }
  }, [navigate]);

  const uniqueLevels = [...new Set(benchData.map((emp) => emp.level))];
  const uniqueLocations = [...new Set(benchData.map((emp) => emp.location))];
  const uniqueSkills = [...new Set(benchData.map((emp) => emp.primarySkill))];

  const filteredData = useMemo(() => {
    return [...benchData]
      .filter((person) => {
        const matchesSearch =
          person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          person.empId.toString().includes(searchTerm);
        const matchesDeployable = !filterDeployable || person.isDeployable;
        const matchesLevel = !filterLevel || person.level === filterLevel;
        const matchesLocation = !filterLocation || person.location === filterLocation;
        const matchesSkill = !filterSkill || person.primarySkill === filterSkill;
        return (
          matchesSearch &&
          matchesDeployable &&
          matchesLevel &&
          matchesLocation &&
          matchesSkill
        );
      })
      .sort((a, b) =>
        sortAsc ? a.agingDays - b.agingDays : b.agingDays - a.agingDays
      );
  }, [benchData, searchTerm, filterDeployable, sortAsc, filterLevel, filterLocation, filterSkill]);

  return (
    <Container fluid className="p-4" style={{ marginTop: "80px", maxWidth: "95vw" }}>
      <Row className="mb-3 g-3 align-items-center">
        <Col md={2}>
          <div className="animated-btn">
            <svg preserveAspectRatio="none" viewBox="0 0 100 100">
              <polyline points="100,0 100,100 0,100 0,0 100,0" />
            </svg>
            <span style={{ padding: "0 0.5rem", flex: 1 }}>
              <Form.Control
                type="text"
                placeholder="Search by name or emp ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 shadow-none w-100"
              />
            </span>
          </div>
        </Col>

        <Col md={2}>
          <div className="animated-btn">
            <svg preserveAspectRatio="none" viewBox="0 0 100 100">
              <polyline points="100,0 100,100 0,100 0,0 100,0" />
            </svg>
            <span style={{ padding: "0 0.5rem", flex: 1 }}>
              <Form.Select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="border-0 shadow-none w-100"
              >
                <option value="">Filter by Level</option>
                {uniqueLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </Form.Select>
            </span>
          </div>
        </Col>

        <Col md={2}>
          <div className="animated-btn">
            <svg preserveAspectRatio="none" viewBox="0 0 100 100">
              <polyline points="100,0 100,100 0,100 0,0 100,0" />
            </svg>
            <span style={{ flex: 1 }}>
              <Form.Select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="border-0 shadow-none w-100"
              >
                <option value="">Filter by Location</option>
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </Form.Select>
            </span>
          </div>
        </Col>

        <Col md={2}>
          <div className="animated-btn">
            <svg preserveAspectRatio="none" viewBox="0 0 100 100">
              <polyline points="100,0 100,100 0,100 0,0 100,0" />
            </svg>
            <span style={{ flex: 1 }}>
              <Form.Select
                value={filterSkill}
                onChange={(e) => setFilterSkill(e.target.value)}
                className="border-0 shadow-none w-100"
              >
                <option value="">Filter by Skill</option>
                {uniqueSkills.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </Form.Select>
            </span>
          </div>
        </Col>

        <Col md={2}>
          <button
            type="button"
            className="animated-btn w-100"
            onClick={() => setFilterDeployable((prev) => !prev)}
          >
            <svg preserveAspectRatio="none" viewBox="0 0 100 100">
              <polyline points="100,0 100,100 0,100 0,0 100,0" />
            </svg>
            <span>{filterDeployable ? "✅ Deployable" : "Only Deployable"}</span>
          </button>
        </Col>

        <Col md={2}>
          <button
            type="button"
            className="animated-btn w-100"
            onClick={() => setSortAsc((prev) => !prev)}
          >
            <svg preserveAspectRatio="none" viewBox="0 0 100 100">
              <polyline points="100,0 100,100 0,100 0,0 100,0" />
            </svg>
            <span>Sort Aging {sortAsc ? "↑" : "↓"}</span>
          </button>
        </Col>
      </Row>


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
    {filteredData.map((person) => (
      <tr key={person.empId}>
        <td>{person.empId}</td>
        <td>
          <Link
            to={`/dashboard/${person.empId}`}
            style={{ textDecoration: "none", fontWeight: 500, color: "#212529" }}
          >
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
    ))}
  </tbody>
</Table>

      )}
    </Container>
  );
}

export default BenchHomepage;
