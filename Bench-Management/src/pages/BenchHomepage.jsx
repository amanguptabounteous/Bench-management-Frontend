import React, { useEffect, useState } from "react";
import { Container, Form, Card, Row, Col, InputGroup, Spinner, Button } from "react-bootstrap";
import { fetchBenchDetails } from "../services/benchService";
import { Link } from "react-router-dom";
import { useMemo } from "react";

function BenchHomepage() {
  const [benchData, setBenchData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortAsc, setSortAsc] = useState(true);
  const [filterDeployable, setFilterDeployable] = useState(false);

  useEffect(() => {
    fetchBenchDetails()
      .then((data) => {
        setBenchData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching bench data:", error);
        setLoading(false);
      });
  }, []);

  const filteredData = useMemo(() => {
    return [...benchData]
      .filter((person) => {
        const matchesSearch =
          person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          person.empId.toString().includes(searchTerm);
        const matchesDeployable = !filterDeployable || person.isDeployable;
        return matchesSearch && matchesDeployable;
      })
      .sort((a, b) =>
        sortAsc ? a.agingDays - b.agingDays : b.agingDays - a.agingDays
      );
  }, [benchData, searchTerm, filterDeployable, sortAsc]);

  return (
    <Container className="rounded shadow-sm p-4 bg-light" style={{ maxWidth: "1100px", marginTop: "80px" }}>
      {/* Search and Filter Controls */}
      <Form className="mb-3">
        <div className="d-flex flex-wrap align-items-center gap-3">
          <Form.Control
            type="text"
            placeholder="Search by name or emp ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="me-2"
            style={{ maxWidth: "65%" }}
          />

          <Form.Check
            type="checkbox"
            label="Only Deployable"
            checked={filterDeployable}
            onChange={(e) => setFilterDeployable(e.target.checked)}
            className="me-2"
          />

          <button
            type="button"
            className="animated-btn"
            onClick={() => setSortAsc((prev) => !prev)}
          >
            <svg preserveAspectRatio="none" viewBox="0 0 100 100">
              <polyline points="100,0 100,100 0,100 0,0 100,0" />
            </svg>
            <span>Sort by Aging {sortAsc ? "↑" : "↓"}</span>
          </button>


        </div>
      </Form>


      {/* Loading Spinner */}
      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {!loading && filteredData.length === 0 && (
        <p className="text-muted text-center">No matching bench employees found.</p>
      )}

      {/* Scrollable Card List */}
      <div
        style={{
          maxHeight: "370px",
          overflowY: "auto",
          paddingRight: "4px",
        }}
      >
        <Row>
          {filteredData.map((person) => (
            <Col xs={12} key={person.empId} className="mb-2">
              <Link
                to={`/dashboard/${person.empId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Card className="shadow-sm gradient-hover-border" style={{ height: "70px" }}>
                  <Card.Body className="d-flex justify-content-between align-items-center py-2 px-3">
                    <div>
                      <strong>{person.name}</strong>{" "}
                      <span className="text-muted">({person.empId})</span>
                      <div style={{ fontSize: "0.9rem", color: "#666" }}>
                        Dept: {person.departmentName}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div>
                        <small className="text-muted">
                          Aging: {person.agingDays} days
                        </small>
                      </div>
                      <div>
                        <small
                          className={`fw-bold ${person.isDeployable ? "text-success" : "text-danger"
                            }`}
                        >
                          {person.isDeployable ? "Deployable" : "Not Deployable"}
                        </small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
}

export default BenchHomepage;
