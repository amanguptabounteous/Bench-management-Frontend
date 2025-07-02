import React from 'react';
import './AssessmentHome.css';
import EmployeeTile from '../../components/EmployeeTile';

function AssessmentLanding() {
  return (
    <div className="container py-5" style={{ marginTop: '80px' }}>
      <div className="row g-4">
        {/* Search Assessment Component */}
        <div className="col-12">
          <div className="card clickable shadow-sm p-4 text-center">
            <h5 className="mb-0">Search Assessment Details</h5>
          </div>
        </div>

        {/* Topics Component */}
        <div className="col-12">
          <div className="card shadow-sm p-3">
            <div className="row g-2">
              {["Java", "C++", "Python", "JavaScript", "React", "Node.js", "SQL"].map((topic, idx) => (
                <div key={idx} className="col-md-3 col-sm-4 col-6">
                  <div className="card topic-card text-center p-3 clickable">
                    {topic}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Make Assignment Component */}
        <div className="col-12">
          <div className="card clickable shadow-sm p-4 text-center">
            <h5 className="mb-0">Assign Assessment</h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssessmentLanding;
