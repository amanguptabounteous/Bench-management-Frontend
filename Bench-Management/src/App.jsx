// App.jsx
import { Routes, Route } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import your components
import SignIn from './pages/SignIn';
import BenchHomepage from './pages/BenchHomepage';
import UserManagement from './pages/ManageUsers';
import AssessmentLanding from './pages/AssessmentSeperateComp/AssessmentHome';
import ReportsPage from './pages/ReportsPage';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import { Navigate } from 'react-router-dom';
import { AuthProvider } from './context/authContext';

// A simple component for unauthorized access
const Unauthorized = () => (
    <div style={{ padding: '50px', textAlign: 'center' }}>
        <h1>403 - Not Authorized</h1>
        <p>You do not have permission to view this page.</p>
    </div>
);

function App() {
    return (
        <AuthProvider>
            <Routes>
                {/* Public routes */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Routes with navbar layout */}
                <Route element={<Layout />}>
                    {/* Routes for Admins and Trainers */}
                    <Route element={<ProtectedRoute allowedRoles={['admin', 'trainer']} />}>
                        <Route path="/assessmentcomp" element={<AssessmentLanding />} />
                    </Route>

                    {/* Routes for Admins ONLY */}
                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                        <Route path="/home" element={<BenchHomepage />} />
                        <Route path="/manage-users" element={<UserManagement />} />
                        <Route path="/bench-report" element={<ReportsPage />} />
                        <Route path="/dashboard/:empId" element={<Dashboard />} />
                        {/* Add any other admin-only routes here */}
                    </Route>
                </Route>
                
                {/* Optional: Add a catch-all or default route */}
                <Route path="*" element={<Navigate to="/signin" />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;