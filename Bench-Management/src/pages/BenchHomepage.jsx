import React, { useState } from "react";
import { Container, Form, Card, Row, Col, InputGroup } from "react-bootstrap";

const dummyData = [
  { name: "John Doe", role: "Frontend Developer" },
  { name: "Jane Smith", role: "Backend Developer" },
  { name: "Alice Johnson", role: "UI/UX Designer" },
];

function BenchHomepage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = dummyData.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="mt-4 rounded shadow-sm p-4 bg-light">
      {/* Search Bar */}
      <Form>
        <InputGroup className="mb-4">
          <Form.Control
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </Form>

      {/* Horizontal Thin Cards */}
      <Row>
        {filteredData.map((person, index) => (
          <Col xs={12} key={index} className="mb-2">
            <Card className="shadow-sm" style={{ height: "60px" }}>
              <Card.Body className="d-flex justify-content-between align-items-center py-2 px-3">
                <div>
                  <strong>{person.name}</strong>
                  <div style={{ fontSize: "0.9rem", color: "#666" }}>
                    {person.role}
                  </div>
                </div>
                <div>
                  <small className="text-muted">Available</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default BenchHomepage;
