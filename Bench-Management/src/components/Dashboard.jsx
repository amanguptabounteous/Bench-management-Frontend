import React, { useState } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('basic');

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
      default:
        return (
          <div className="tab-content-section bg-dark text-white p-4 rounded">
            <h5 className="text-capitalize">{activeTab} Section</h5>
            <p>This is the {activeTab} content area.</p>
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
                Basic Details
              </button>
              <button className={`nav-link ${activeTab === 'interview' ? 'active' : ''}`} onClick={() => setActiveTab('interview')}>
                Interview
              </button>
              <button className={`nav-link ${activeTab === 'bench' ? 'active' : ''}`} onClick={() => setActiveTab('bench')}>
                Bench
              </button>
              <button className={`nav-link ${activeTab === 'tab3' ? 'active' : ''}`} onClick={() => setActiveTab('tab3')}>
                Tab 3
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
