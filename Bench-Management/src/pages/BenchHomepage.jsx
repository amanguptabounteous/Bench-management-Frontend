// import React, { useState, useMemo } from "react";
// import {
//   Container,
//   Table,
//   Form,
//   Spinner,
//   Row,
//   Col,
//   OverlayTrigger,
//   Tooltip,
// } from "react-bootstrap";
// import { useNavigate, Link } from "react-router-dom";
// import "./BenchHomepage.css";
// import useBenchData from "../services/useBenchData";

// function BenchHomepage() {
//   const { benchData, loading } = useBenchData();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortAsc, setSortAsc] = useState(true);
//   const [filterDeployable, setFilterDeployable] = useState(false);
//   const [filterLevel, setFilterLevel] = useState("");
//   const [filterLocation, setFilterLocation] = useState("");
//   const [filterSkill, setFilterSkill] = useState("");

//   const uniqueLevels = [...new Set(benchData.map((emp) => emp.level))];
//   const uniqueLocations = [...new Set(benchData.map((emp) => emp.location))];
//   const uniqueSkills = [...new Set(benchData.map((emp) => emp.primarySkill))];

//   const filteredData = useMemo(() => {
//     return [...benchData]
//       .filter((person) => {
//         const matchesSearch =
//           person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           person.empId.toString().includes(searchTerm);
//         const matchesDeployable = !filterDeployable || person.isDeployable;
//         const matchesLevel = !filterLevel || person.level === filterLevel;
//         const matchesLocation = !filterLocation || person.location === filterLocation;
//         const matchesSkill = !filterSkill || person.primarySkill === filterSkill;
//         return (
//           matchesSearch &&
//           matchesDeployable &&
//           matchesLevel &&
//           matchesLocation &&
//           matchesSkill
//         );
//       })
//       .sort((a, b) =>
//         sortAsc ? a.agingDays - b.agingDays : b.agingDays - a.agingDays
//       );
//   }, [benchData, searchTerm, filterDeployable, sortAsc, filterLevel, filterLocation, filterSkill]);

//   return (
//     <Container fluid className="p-4" style={{ marginTop: "80px", maxWidth: "95vw" }}>
//       <Row className="mb-3 g-3 align-items-center">
//         <Col md={2}>
//           <div className="animated-btn">
//             <svg preserveAspectRatio="none" viewBox="0 0 100 100">
//               <polyline points="100,0 100,100 0,100 0,0 100,0" />
//             </svg>
//             <span style={{ padding: "0 0.5rem", flex: 1 }}>
//               <Form.Control
//                 type="text"
//                 placeholder="Search by name or emp ID..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="border-0 shadow-none w-100"
//               />
//             </span>
//           </div>
//         </Col>

//         <Col md={2}>
//           <div className="animated-btn">
//             <svg preserveAspectRatio="none" viewBox="0 0 100 100">
//               <polyline points="100,0 100,100 0,100 0,0 100,0" />
//             </svg>
//             <span style={{ padding: "0 0.5rem", flex: 1 }}>
//               <Form.Select
//                 value={filterLevel}
//                 onChange={(e) => setFilterLevel(e.target.value)}
//                 className="border-0 shadow-none w-100"
//               >
//                 <option value="">Filter by Level</option>
//                 {uniqueLevels.map((level) => (
//                   <option key={level} value={level}>
//                     {level}
//                   </option>
//                 ))}
//               </Form.Select>
//             </span>
//           </div>
//         </Col>

//         <Col md={2}>
//           <div className="animated-btn">
//             <svg preserveAspectRatio="none" viewBox="0 0 100 100">
//               <polyline points="100,0 100,100 0,100 0,0 100,0" />
//             </svg>
//             <span style={{ flex: 1 }}>
//               <Form.Select
//                 value={filterLocation}
//                 onChange={(e) => setFilterLocation(e.target.value)}
//                 className="border-0 shadow-none w-100"
//               >
//                 <option value="">Filter by Location</option>
//                 {uniqueLocations.map((loc) => (
//                   <option key={loc} value={loc}>
//                     {loc}
//                   </option>
//                 ))}
//               </Form.Select>
//             </span>
//           </div>
//         </Col>

//         <Col md={2}>
//           <div className="animated-btn">
//             <svg preserveAspectRatio="none" viewBox="0 0 100 100">
//               <polyline points="100,0 100,100 0,100 0,0 100,0" />
//             </svg>
//             <span style={{ flex: 1 }}>
//               <Form.Select
//                 value={filterSkill}
//                 onChange={(e) => setFilterSkill(e.target.value)}
//                 className="border-0 shadow-none w-100"
//               >
//                 <option value="">Filter by Skill</option>
//                 {uniqueSkills.map((skill) => (
//                   <option key={skill} value={skill}>
//                     {skill}
//                   </option>
//                 ))}
//               </Form.Select>
//             </span>
//           </div>
//         </Col>

//         <Col md={2}>
//           <button
//             type="button"
//             className="animated-btn w-100"
//             onClick={() => setFilterDeployable((prev) => !prev)}
//           >
//             <svg preserveAspectRatio="none" viewBox="0 0 100 100">
//               <polyline points="100,0 100,100 0,100 0,0 100,0" />
//             </svg>
//             <span>{filterDeployable ? "✅ Deployable" : "Only Deployable"}</span>
//           </button>
//         </Col>

//         <Col md={2}>
//           <button
//             type="button"
//             className="animated-btn w-100"
//             onClick={() => setSortAsc((prev) => !prev)}
//           >
//             <svg preserveAspectRatio="none" viewBox="0 0 100 100">
//               <polyline points="100,0 100,100 0,100 0,0 100,0" />
//             </svg>
//             <span>Sort Aging {sortAsc ? "↑" : "↓"}</span>
//           </button>
//         </Col>
//       </Row>

//       {loading ? (
//         <div className="text-center">
//           <Spinner animation="border" variant="primary" />
//         </div>
//       ) : (
//         <Table bordered hover responsive className="bench-table shadow-sm align-middle">
//           <thead>
//             <tr>
//               <th>Emp ID</th>
//               <th>Name</th>
//               <th>Primary Skill</th>
//               <th>Level</th>
//               <th>Location</th>
//               <th>Aging</th>
//               <th>Deployable</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.map((person) => (
//               <tr key={person.empId}>
//                 <td>{person.empId}</td>
//                 <td>
//                   <Link
//                     to={`/dashboard/${person.empId}`}
//                     style={{ textDecoration: "none", fontWeight: 500, color: "#212529" }}
//                   >
//                     {person.name}
//                   </Link>
//                 </td>
//                 <td>{person.primarySkill}</td>
//                 <td>{person.level}</td>
//                 <td>{person.location}</td>
//                 <td>
//                   <OverlayTrigger
//                     placement="top"
//                     overlay={
//                       <Tooltip>
//                         Dept: {person.departmentName}
//                         <br />
//                         Bench: {person.benchStartDate} to {person.benchEndDate}
//                       </Tooltip>
//                     }
//                   >
//                     <span className="aging-tooltip">{person.agingDays} days</span>
//                   </OverlayTrigger>
//                 </td>
//                 <td>
//                   <span
//                     className={`deploy-badge ${
//                       person.isDeployable ? "text-deployable" : "text-not-deployable"
//                     }`}
//                   >
//                     {person.isDeployable ? "Yes" : "No"}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}
//     </Container>
//   );
// }

// export default BenchHomepage;

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
  Modal, // <-- Added for feedback modal
  Button, // <-- Added for feedback modal
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import "./BenchHomepage.css";
import useBenchData from "../services/useBenchData";

function BenchHomepage() {
  const { benchData, loading } = useBenchData();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [filterDeployable, setFilterDeployable] = useState(false);
  const [filterLevel, setFilterLevel] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterSkill, setFilterSkill] = useState("");

  // --- Feedback Modal State ---
  const [showFeedback, setShowFeedback] = useState(false); // Modal visibility
  const [selectedFeedback, setSelectedFeedback] = useState(""); // Feedback text
  const [selectedPerson, setSelectedPerson] = useState(null); // Person object

  // Unique filter values
  const uniqueLevels = [...new Set(benchData.map((emp) => emp.level))];
  const uniqueLocations = [...new Set(benchData.map((emp) => emp.location))];
  const uniqueSkills = [...new Set(benchData.map((emp) => emp.primarySkill))];

  // Filtered and sorted data
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

  // --- Feedback Modal Handlers ---
  const handleShowFeedback = (person) => {
    setSelectedFeedback(person.feedback || "No feedback available."); // Use feedback property or fallback
    setSelectedPerson(person);
    setShowFeedback(true);
  };

  const handleCloseFeedback = () => {
    setShowFeedback(false);
    setSelectedPerson(null);
  };

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
              <th>Feedback</th> {/* <-- Added Feedback column header */}
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
                {/* --- Feedback Button in each row --- */}
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleShowFeedback(person)}
                  >
                    Feedback
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* --- Feedback Modal --- */}
      <Modal show={showFeedback} onHide={handleCloseFeedback} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Feedback: {selectedPerson ? selectedPerson.name : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFeedback}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseFeedback}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default BenchHomepage;