// App.jsx
import { Routes, Route } from 'react-router-dom';
import './App.css';
import GlobalNavbar from './components/GlobalNav';
import BenchHomepage from './components/BenchHomepage';
import Dashboard from './components/Dashboard';
import AssessmentLanding from './components/AssessmentSeperateComp/AssessmentHome.jsx';

function App() {
  return (
    <>
      <GlobalNavbar />

      <Routes>
        <Route path="/" element={<BenchHomepage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assessmentcomp" element={<AssessmentLanding />} />
      </Routes>
    </>
  );
}

export default App;
