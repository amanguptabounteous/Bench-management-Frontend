import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEmployeeById } from '../services/benchService';
import { fetchTrainingDetailsbyempID } from '../services/trainingService';
import { fetchEmployeeScore } from '../services/empScoreService';
import { fetchInterviewCyclebyEmpId, fetchInterviewRoundsbyCycleId } from '../services/interviewService';
import { addInterviewCycle, addInterviewRound } from '../services/interviewService';
import ExpandableCard from '../components/ExpandableCard';
import './Dashboard.css';
import useBenchData from '../services/useBenchData';


function Dashboard() {
  // Only use loading from useBenchData to check authentication/data fetch
  const { loading: benchLoading } = useBenchData();
  const { empId } = useParams();
  const [activeTab, setActiveTab] = useState('basic');
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trainingData, setTrainingData] = useState([]);
  const [trainingLoading, setTrainingLoading] = useState(true);
  const [scoreData, setScoreData] = useState([]);
  const [scoreLoading, setScoreLoading] = useState(true);
  const [interviewCycles, setInterviewCycles] = useState([]);
  const [interviewRounds, setInterviewRounds] = useState({});
  const [interviewLoading, setInterviewLoading] = useState(true);
  const [showCycleForm, setShowCycleForm] = useState(false);
  const [showRoundFormId, setShowRoundFormId] = useState(null); // for cycle-specific round forms

  const [newCycle, setNewCycle] = useState({ client: '', title: '' });
  const [newRound, setNewRound] = useState({
    date: '', panel: '', status: '', feedback: '', detailedFeedback: '', review: '', round: '', department: ''
  });


  const handleAddCycle = async () => {
  try {
    await addInterviewCycle(empId, newCycle);
    setShowCycleForm(false);
    setNewCycle({ client: '', title: '' });
    reloadInterviewData();
  } catch (err) {
    alert("Error adding cycle");
  }
};

const handleAddRound = async (cycle) => {
  const roundPayload = {
  empId: Number(empId),
  date: newRound.date,
  panel: newRound.panel,
  status: newRound.status,
  feedback: newRound.feedback,
  detailedFeedback: newRound.detailedFeedback,
  review: newRound.review,
  round: Number(newRound.round),
  department: newRound.department,
  client: cycle.client // 🧠 important to include
};


  console.log("🚀 Submitting round payload:", roundPayload);

  try {
    await addInterviewRound(cycle.cycleId, roundPayload);
    setShowRoundFormId(null);
    setNewRound({
      date: '',
      panel: '',
      status: '',
      feedback: '',
      detailedFeedback: '',
      review: '',
      round: '',
      department: ''
    });
    reloadInterviewData();
  } catch (err) {
    console.error("❌ Error adding round:", err);
    alert("Error adding round");
  }
};


const reloadInterviewData = async () => {
  setInterviewLoading(true);
  try {
    const cycles = await fetchInterviewCyclebyEmpId(empId);
    const roundsMap = {};
    for (const cycle of cycles) {
      const rounds = await fetchInterviewRoundsbyCycleId(cycle.cycleId);
      roundsMap[cycle.cycleId] = rounds;
    }
    setInterviewCycles(cycles);
    setInterviewRounds(roundsMap);
  } catch (err) {
    console.error(err);
  }
  setInterviewLoading(false);
};

  useEffect(() => {
    setLoading(true);
    fetchEmployeeById(empId)
      .then(data => {
        setEmployeeData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching employee data:', err);
        setLoading(false);
      });

    setTrainingLoading(true);
    fetchTrainingDetailsbyempID(empId)
      .then(data => {
        setTrainingData(data);
        setTrainingLoading(false);
      })
      .catch(err => {
        console.error('Error fetching training data:', err);
        setTrainingLoading(false);
      });

    setScoreLoading(true);
    fetchEmployeeScore(empId)
      .then(data => {
        setScoreData(data);
        setScoreLoading(false);
      })
      .catch(err => {
        console.error('Error fetching assessment scores:', err);
        setScoreLoading(false);
      });

    setInterviewLoading(true);
    fetchInterviewCyclebyEmpId(empId)
      .then(async (cycles) => {
        setInterviewCycles(cycles);

        const roundsMap = {};
        for (const cycle of cycles) {
          try {
            const rounds = await fetchInterviewRoundsbyCycleId(cycle.cycleId);
            roundsMap[cycle.cycleId] = rounds;
          } catch (roundErr) {
            console.error(`Error fetching rounds for cycle ${cycle.cycleId}:`, roundErr);
          }
        }

        setInterviewRounds(roundsMap);
        setInterviewLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching interview cycles:', err);
        setInterviewLoading(false);
      });

  }, [empId]);

  if (benchLoading || loading) {
    return (
      <div className="text-center py-5">
        <span className="spinner-border text-primary" />
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <>
            {/* Employee Info Block */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="row g-4">
                  <div className="col-md-6">
                    <strong>Employee ID:</strong> {employeeData?.empId}
                  </div>
                  <div className="col-md-6">
                    <strong>Name:</strong> {employeeData?.name}
                  </div>
                  <div className="col-md-6">
                    <strong>Email:</strong> {employeeData?.email}
                  </div>
                  <div className="col-md-6">
                    <strong>Date of Joining:</strong> {employeeData?.doj}
                  </div>
                  <div className="col-md-6">
                    <strong>Level:</strong> {employeeData?.level}
                  </div>
                  <div className="col-md-6">
                    <strong>Primary Skill:</strong> {employeeData?.primarySkill}
                  </div>
                  <div className="col-md-6">
                    <strong>Secondary Skill:</strong> {/* Placeholder or '-' */}
                    -
                  </div>
                </div>
              </div>
            </div>

            {/* Bench Details Block */}
            <div className="card mt-4 border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="mb-4">Bench Details</h5>
                <div className="row g-4">
                  <div className="col-md-6">
                    <strong>Department Name:</strong> {employeeData?.departmentName}
                  </div>
                  <div className="col-md-6">
                    <strong>Location:</strong> {employeeData?.location}
                  </div>
                  <div className="col-md-6">
                    <strong>Aging:</strong> {employeeData?.agingDays} days
                  </div>
                  <div className="col-md-6">
                    <strong>Bench Start Date:</strong> {employeeData?.benchStartDate}
                  </div>
                  <div className="col-md-6">
                    <strong>Bench End Date:</strong> {employeeData?.benchEndDate || '--'}
                  </div>
                  <div className="col-md-6">
                    <strong>Status:</strong>{" "}
                    {employeeData?.isDeployable ? "Deployable" : "Not Deployable"}
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'training':
        if (trainingLoading) {
          return (
            <div className="text-center py-4">
              <span className="spinner-border text-primary" />
            </div>
          );
        }

        if (!trainingData.length) {
          return (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="mb-4">Training Details</h5>
                <p className="text-muted">No training records found.</p>
              </div>
            </div>
          );
        }

        return (
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="mb-4">Training Details</h5>
              <div
                style={{
                  maxHeight: '350px',
                  overflowY: 'auto',
                  paddingRight: '4px',
                }}
              >
                {trainingData.map((training) => (
                  <ExpandableCard
                    key={training.trainingId}
                    title={`TRN-${training.trainingId}`}
                    subtitle={training.topics}
                  >
                    <div className="row g-4">
                      <div className="col-md-6">
                        <strong>Start Date:</strong> {training.startDate}
                      </div>
                      <div className="col-md-6">
                        <strong>End Date:</strong> {training.endDate}
                      </div>
                      <div className="col-md-6">
                        <strong>Mentor:</strong> {training.mentor}
                      </div>
                      <div className="col-md-6">
                        <strong>Feedback:</strong> {training.feedback}
                      </div>
                      <div className="col-md-6">
                        <strong>Topics Covered:</strong> {training.topics}
                      </div>
                    </div>
                  </ExpandableCard>
                ))}
              </div>
            </div>
          </div>
        );

      case 'assessment':
        if (scoreLoading) {
          return (
            <div className="text-center py-4">
              <span className="spinner-border text-primary" />
            </div>
          );
        }

        if (!scoreData.length) {
          return (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="mb-4">Assessment Details</h5>
                <p className="text-muted">No assessment records found.</p>
              </div>
            </div>
          );
        }

        return (
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="mb-4">Assessment Details</h5>
              <div
                style={{
                  maxHeight: '350px',
                  overflowY: 'auto',
                  paddingRight: '4px',
                }}
              >
                {scoreData.map((score) => (
                  <ExpandableCard
                    key={score.assessmentId}
                    title={`Assessment-${score.assessmentId}`}
                    subtitle={`${score.topic} — ${score.empScore}/${score.totalScore}`}
                  >
                    <div className="row g-4">
                      <div className='col-md-6'><strong>Trainer Name:</strong> {score.trainerName}</div>
                      <div className="col-md-6">
                        <strong>Name:</strong> {score.name}
                      </div>
                      <div className="col-md-6">
                        <strong>Employee ID:</strong> {score.empId}
                      </div>
                      <div className="col-md-6">
                        <strong>Topic:</strong> {score.topic}
                      </div>
                      <div className="col-md-6">
                        <strong>Score:</strong> {score.empScore} / {score.totalScore}
                      </div>
                    </div>
                  </ExpandableCard>
                ))}
              </div>
            </div>
          </div>
        );

      case 'interview':
        if (interviewLoading) {
          return (
            <div className="text-center py-4">
              <span className="spinner-border text-primary" />
            </div>
          );
        }

        if (!interviewCycles.length) {
          return (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="mb-4">Interview Details</h5>
                <p className="text-muted">No interview cycles found.</p>
              </div>
            </div>
          );
        }

        return (
  <div className="card border-0 shadow-sm">
    <div className="card-body p-4">
      <h5 className="mb-4">Interview Details</h5>

      {/* Add Interview Cycle Button */}
      <div className="mb-3">
        <button className="btn btn-outline-primary" onClick={() => setShowCycleForm(true)}>
          + Add Interview Cycle
        </button>
      </div>

      {/* Add Interview Cycle Form */}
      {showCycleForm && (
        <div className="card p-3 my-3 bg-light">
          <h6 className="mb-3">Add New Interview Cycle</h6>
          <div className="row g-3">
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="Client"
                value={newCycle.client}
                onChange={(e) => setNewCycle({ ...newCycle, client: e.target.value })}
              />
            </div>
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="Title"
                value={newCycle.title}
                onChange={(e) => setNewCycle({ ...newCycle, title: e.target.value })}
              />
            </div>
            <div className="col-md-2 d-grid">
              <button className="btn btn-primary" onClick={handleAddCycle}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interview Cycle List */}
      <div
        style={{
          maxHeight: '400px',
          overflowY: 'auto',
          paddingRight: '4px',
        }}
      >
        {interviewCycles.map((cycle) => (
          <ExpandableCard
            key={cycle.cycleId}
            title={cycle.client}
            subtitle={cycle.title}
          >
            {interviewRounds[cycle.cycleId] && interviewRounds[cycle.cycleId].length > 0 ? (
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Round</th>
                      <th>Date</th>
                      <th>Panel</th>
                      <th>Status</th>
                      <th>Feedback</th>
                      <th>Review</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interviewRounds[cycle.cycleId].map((round) => (
                      <tr key={round.interviewId}>
                        <td>{round.round}</td>
                        <td>{round.date}</td>
                        <td>{round.panel}</td>
                        <td>{round.status}</td>
                        <td>{round.feedback}</td>
                        <td>{round.review}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted">No rounds found for this cycle.</p>
            )}

            {/* Add Round Button */}
            <button
              className="btn btn-outline-success mt-2"
              onClick={() => setShowRoundFormId(cycle.cycleId)}
            >
              + Add Round
            </button>

            {/* Add Round Form */}
            {showRoundFormId === cycle.cycleId && (
              <div className="card p-3 my-3 bg-light">
                <h6 className="mb-3">Add Round to {cycle.client} - {cycle.title}</h6>
                <div className="row g-3">
                  <div className="col-md-3">
                    <input
                      type="date"
                      className="form-control"
                      value={newRound.date}
                      onChange={(e) => setNewRound({ ...newRound, date: e.target.value })}
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Panel"
                      value={newRound.panel}
                      onChange={(e) => setNewRound({ ...newRound, panel: e.target.value })}
                    />
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={newRound.status}
                      onChange={(e) => setNewRound({ ...newRound, status: e.target.value })}
                    >
                      <option value="">Select Status</option>
                      <option value="PASSED">PASSED</option>
                      <option value="FAILED">FAILED</option>
                      <option value="PENDING">PENDING</option>
                      <option value="SUCESS">SUCESS</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Round Number"
                      value={newRound.round}
                      onChange={(e) => setNewRound({ ...newRound, round: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <select
                      
                      className="form-select"
                      placeholder="Feedback"
                      value={newRound.feedback}
                      onChange={(e) => setNewRound({ ...newRound, feedback: e.target.value })}
                    ><option value="">Select Feedback</option>
                    <option value="POSITIVE">POSITIVE</option>
                    <option value="NEGATIVE">NEGATIVE</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Detailed Feedback"
                      value={newRound.detailedFeedback}
                      onChange={(e) => setNewRound({ ...newRound, detailedFeedback: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Review"
                      value={newRound.review}
                      onChange={(e) => setNewRound({ ...newRound, review: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Department"
                      value={newRound.department}
                      onChange={(e) => setNewRound({ ...newRound, department: e.target.value })}
                    />
                  </div>
                  <div className="col-md-3">
                    <button
                      className="btn btn-success w-100"
                      onClick={() => handleAddRound(cycle)}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </ExpandableCard>
        ))}
      </div>
    </div>
  </div>
);


      default:
        return null;
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
            <h3 className="mt-3 mb-1">{employeeData?.name || "Employee"}</h3>
            <p className="text-muted mb-3">{employeeData?.email || "email@example.com"}</p>
          </div>
        </div>

        {/* Tabs and Content */}
        <div className="row">
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

