import React, { useState } from 'react';
import axios from 'axios';
 
const BenchReport = () => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const [reportData, setReportData] = useState([]);
 
  const handleGenerate = async () => {
  if (!start || !end) {
    alert('Please select both start and end dates');
    return;
  }
 
  setLoading(true);
  setDebugInfo('Loading...');
  setReportData([]);
 
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token missing. Please sign in again.');
    }
 
    const response = await axios.get(
      `http://localhost:8080/bms/details/bench-end-date-range`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          start,
          end
        }
      }
    );
 
    const data = Array.isArray(response.data) ? response.data : [];
 
    if (data.length === 0) {
      alert('No candidates found for the selected date range');
      setDebugInfo('No data found.');
      return;
    }
 
    setReportData(data);
    const csv = generateCSV(data);
    downloadCSV(csv, `Bench_Report_${start}_to_${end}.csv`);
    setDebugInfo(`Report generated for ${data.length} candidates`);
  } catch (error) {
    console.error('Error:', error);
    setDebugInfo(error.response?.data?.message || 'Failed to generate report');
    alert('Failed to generate report: ' + error.message);
  }
 
  setLoading(false);
};
 
 
  const generateCSV = (data) => {
    const headers = [
      'Emp ID',
      'Name',
      'Department',
      'Email',
      'Bench Start Date',
      'Bench End Date',
      'Location',
      'Primary Skill',
      'Level',
    ];
 
    const rows = data.map(c => [
      c.empId || '',
      c.name || '',
      c.departmentName || '',
      c.email || '',
      c.benchStartDate || '',
      c.benchEndDate || '',
      c.location || '',
      c.primarySkill || '',
      c.level || ''
    ]);
 
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => {
        return (field && field.toString().includes(',')) ? `"${field}"` : field;
      }).join(','))
      .join('\n');
 
    return csvContent;
  };
 
  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(href);
  };
 
  return (
    <div className="container" style={{ marginTop: "120px" }}>     
      <h2 className="mb-4">Generate Bench Exit Report</h2>
 
      <div className="row g-3 mb-3">
        <div className="col-md-5">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className="form-control"
            value={start}
            onChange={e => setStart(e.target.value)}
          />
        </div>
        <div className="col-md-5">
          <label className="form-label">End Date</label>
          <input
            type="date"
            className="form-control"
            value={end}
            onChange={e => setEnd(e.target.value)}
          />
        </div>
        <div className="col-md-2 d-flex align-items-end">
          <button
            className="btn btn-primary w-100"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>
 
      {debugInfo && (
        <div className="alert alert-info mt-3">
          <strong>Debug Info:</strong> {debugInfo}
        </div>
      )}
 
      {reportData.length > 0 && (
        <div className="mt-3">
          <h5>Preview:</h5>
          <table className="table table-bordered table-sm">
            <thead className="table-light">
              <tr>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Level</th>
                <th>Primary Skill</th>
                <th>Bench End Date</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((emp, idx) => (
                <tr key={idx}>
                  <td>{emp.empId}</td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.level}</td>
                  <td>{emp.primarySkill}</td>
                  <td>{emp.benchEndDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
 
      <div className="mt-4">
        <h5>Instructions:</h5>
        <ul>
          <li>Select start and end date</li>
          <li>Click "Generate" to download CSV</li>
          <li>CSV includes candidates whose bench end date falls in range</li>
        </ul>
      </div>
    </div>
  );
};
 
export default BenchReport;