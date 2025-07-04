// App.jsx
import { Routes, Route } from 'react-router-dom';
import './App.css';
import SignIn from './pages/SignIn';
import GlobalNavbar from './components/GlobalNav';
import BenchHomepage from './pages/BenchHomepage';
import Dashboard from './pages/Dashboard';
import AssessmentLanding from './pages/AssessmentSeperateComp/AssessmentHome';
import AssignAssessment from './pages/AssessmentSeperateComp/AssignAssesment';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <>
      <GlobalNavbar />

      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/home" element={<BenchHomepage />} />
        <Route path="/dashboard/:empId" element={<Dashboard />} />
        <Route path="/assessmentcomp" element={<AssessmentLanding />} />
        <Route path="/assign-assessment" element={<AssignAssessment />} />
      </Routes>
    </>
  );
}

export default App;
