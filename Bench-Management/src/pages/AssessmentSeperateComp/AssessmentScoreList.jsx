import React, { useEffect, useState } from 'react';
import { Table, Spinner } from 'react-bootstrap';
import { fetchAllEmployeeScoresbyTopic } from '../../services/empScoreService';

function AssessmentScoreList({
  assessmentId,
  topic,
  searchEmpId,
  searchEmpName,
  selectedDate,
  minScore
}) {
  const [allScores, setAllScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScores = async () => {
      try {
        const data = await fetchAllEmployeeScoresbyTopic(topic);
        const relevant = data.filter(item => item.assessmentId === assessmentId);
        setAllScores(relevant);
      } catch (err) {
        console.error("Failed to fetch scores:", err);
      } finally {
        setLoading(false);
      }
    };
    loadScores();
  }, [assessmentId, topic]);

  const filtered = allScores.filter(item => {
    const matchesEmpId = !searchEmpId || item.empId.toString().includes(searchEmpId);
    const matchesEmpName = !searchEmpName || item.name.toLowerCase().includes(searchEmpName.toLowerCase());
    const matchesMinScore = !minScore || item.empScore >= parseInt(minScore);
    const matchesDate = !selectedDate || (item.date && item.date === selectedDate); // ignore if no date field

    return matchesEmpId && matchesEmpName && matchesMinScore && matchesDate;
  });

  if (loading) {
    return <div className="text-center"><Spinner animation="border" size="sm" /></div>;
  }

  if (!filtered.length) {
    return <p className="text-muted">No matching employee scores for this assessment.</p>;
  }

  return (
    <Table striped bordered hover size="sm" responsive>
      <thead>
        <tr>
          <th>Name</th>
          <th>Emp ID</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {filtered.map((score, idx) => (
          <tr key={idx}>
            <td>{score.name}</td>
            <td>{score.empId}</td>
            <td>{score.empScore} / {score.totalScore}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default AssessmentScoreList;
