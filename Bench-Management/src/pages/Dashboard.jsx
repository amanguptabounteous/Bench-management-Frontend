import React, { useState } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('basic');
//   const [activeTab, setActiveTab] = useState('assessment');

  // Dummy data for assessments
  const assessments = [
    {
      assessment_id: "ASM-001",
      assessment_link: "https://example.com/assessment/1",
      topic: "React Basics",
      score: 85,
    },
    {
      assessment_id: "ASM-002",
      assessment_link: "https://example.com/assessment/2",
      topic: "Node.js Fundamentals",
      score: 90,
    },
    {
      assessment_id: "ASM-003",
      assessment_link: "https://example.com/assessment/3",
      topic: "Soft Skills",
      score: 78,
    },
    {
      assessment_id: "ASM-004",
      assessment_link: "https://example.com/assessment/4",
      topic: "Interview Preparation",
      score: 90,
    },
    {
      assessment_id: "ASM-003",
      assessment_link: "https://example.com/assessment/3",
      topic: "Soft Skills",
      score: 78,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <>
            {/* Main Info Block */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="row g-4">
                  <div className="col-md-6">
                    <strong>Employee ID:</strong> EMP123456
                  </div>
                  <div className="col-md-6">
                    <strong>Name:</strong> Aman Gupta
                  </div>
                  <div className="col-md-6">
                    <strong>Email:</strong> aman.gupta@example.com
                  </div>
                  <div className="col-md-6">
                    <strong>Date of Joining:</strong> 2023-01-01
                  </div>
                  <div className="col-md-6">
                    <strong>Level:</strong> L2
                  </div>
                  <div className="col-md-6">
                    <strong>Primary Skill:</strong> React
                  </div>
                  <div className="col-md-6">
                    <strong>Secondary Skill:</strong> Node.js
                  </div>
                </div>
              </div>
            </div>

            {/* Expandable Details Block */}
            <div className="card mt-4 border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="mb-4">Bench Details</h5>
                <div className="row g-4">
                  <div className="col-md-6">
                    <strong>Department Name:</strong> Engineering
                  </div>
                  <div className="col-md-6">
                    <strong>Location:</strong> Bengaluru
                  </div>
                  <div className="col-md-6">
                    <strong>Aging:</strong> 30 days
                  </div>
                  <div className="col-md-6">
                    <strong>Bench Start Date:</strong> 2024-05-01
                  </div>
                  <div className="col-md-6">
                    <strong>Bench End Date:</strong> --
                  </div>
                  <div className="col-md-6">
                    <strong>Status:</strong> On Bench
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      
      case 'training':
        return (
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="mb-4">Training Details</h5>
              <div className="row g-4">
                <div className="col-md-6">
                  <strong>Training ID:</strong> TRN-2024-001
                </div>
                <div className="col-md-6">
                  <strong>Start Date:</strong> 2024-06-01
                </div>
                <div className="col-md-6">
                  <strong>End Date:</strong> 2024-06-15
                </div>
                <div className="col-md-6">
                  <strong>Mentor:</strong> Priya Sharma
                </div>
                <div className="col-md-6">
                  <strong>Feedback:</strong> Excellent progress and participation.
                </div>
                <div className="col-md-6">
                  <strong>Topics Covered:</strong> React, Node.js, Soft Skills
                </div>
              </div>
            </div>
          </div>
        );

      case 'assessment':
        return (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <h5 className="mb-4">Assessment Details</h5>
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Assessment ID</th>
                    <th>Assessment Link</th>
                    <th>Topic</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.map((a) => (
                    <tr key={a.assessment_id}>
                      <td>{a.assessment_id}</td>
                      <td>
                        <a href={a.assessment_link} target="_blank" rel="noopener noreferrer">
                          View Assessment
                        </a>
                      </td>
                      <td>{a.topic}</td>
                      <td>{a.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );

      case 'interview':
        return (
            <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
                <h5 className="mb-4">Interview Details</h5>
                <div className="row g-4">
                <div className="col-md-6">
                    <strong>Interview ID:</strong> INT-2024-001
                </div>
                <div className="col-md-6">
                    <strong>Date:</strong> 2024-07-01
                </div>
                <div className="col-md-6">
                    <strong>Panel:</strong> John Doe, Priya Sharma
                </div>
                <div className="col-md-6">
                    <strong>Feedback:</strong> Good technical skills.
                </div>
                <div className="col-md-6">
                    <strong>Status:</strong> Selected
                </div>
                </div>
            </div>
            </div>
        );
    }
  };

  return (
    <div className="bg-light">
      <div className="container py-5">
        {/* Profile Header */}
        <div className="col-12 mb-4">
          <div className="profile-header position-relative mb-4">
            <div className="position-absolute top-0 end-0 p-3">
              <button className="btn btn-light">
                <i className="fas fa-edit me-2"></i>Edit Cover
              </button>
            </div>
          </div>
          <div className="text-center">
            <div className="position-relative d-inline-block">
              <img
                src="https://randomuser.me/api/portraits/men/40.jpg"
                className="rounded-circle profile-pic"
                alt="Profile"
              />
              <button className="btn btn-primary btn-sm position-absolute bottom-0 end-0 rounded-circle">
                <i className="fas fa-camera"></i>
              </button>
            </div>
            <h3 className="mt-3 mb-1">Aman Gupta</h3>
            <p className="text-muted mb-3">Software Developer</p>
          </div>
        </div>

        <div className="row">
          {/* Vertical Tabs */}
          <div className="col-md-3">
            <div className="nav flex-column nav-pills">
              <button className={`nav-link ${activeTab === 'basic' ? 'active' : ''}`} onClick={() => setActiveTab('basic')}>
                Employee Details
              </button>
              <button className={`nav-link ${activeTab === 'training' ? 'active' : ''}`} onClick={() => setActiveTab('training')}>
                Training Details
              </button>
              <button className={`nav-link ${activeTab === 'assessment' ? 'active' : ''}`} onClick={() => setActiveTab('assessment')}>
                Assessment Details
              </button>
              <button className={`nav-link ${activeTab === 'interview' ? 'active' : ''}`} onClick={() => setActiveTab('interview')}>
                Interview Details
              </button>
            </div>
          </div>
          <div className="col-md-9">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
