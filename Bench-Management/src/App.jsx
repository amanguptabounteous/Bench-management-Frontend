// App.jsx
import { Routes, Route } from 'react-router-dom';
import './App.css';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import BenchHomepage from './pages/BenchHomepage';
import ManageUsers from './pages/ManageUsers';
import Dashboard from './pages/Dashboard';
import AssessmentLanding from './pages/AssessmentSeperateComp/AssessmentHome';
import AssignAssessment from './pages/AssessmentSeperateComp/AssignAssesment';
import Layout from './components/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Routes>
      {/* Routes without navbar */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/register" element={<Register />} />

      {/* Routes with navbar using Layout */}
      <Route element={<Layout />}>
        <Route path="/home" element={<BenchHomepage />} />
        <Route path="/dashboard/:empId" element={<Dashboard />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/assessmentcomp" element={<AssessmentLanding />} />
        <Route path="/assign-assessment" element={<AssignAssessment />} />
      </Route>
    </Routes>
  );
}

export default App;
