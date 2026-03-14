import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Toolbar, Typography } from '@mui/material';
import axios from 'axios';

import theme from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import ManageTeachers from './pages/ManageTeachers';
import UpdateAttendance from './pages/UpdateAttendance';
import AdminReports from './pages/AdminReports';
import ParentDashboard from './pages/ParentDashboard';
import ViewAttendance from './pages/ViewAttendance';
import SubmitReport from './pages/SubmitReport';

const SCHOOL_NAME_DEFAULT = 'EduTracker School';

// Main Layout Component
const AppLayout = ({ children }) => {
  const { user } = useAuth();
  const [schoolName, setSchoolName] = useState(SCHOOL_NAME_DEFAULT);

  useEffect(() => {
    const fetchSchoolName = async () => {
      try {
        const response = await axios.get('/api/admin/public/school');
        setSchoolName(response.data.name);
      } catch (error) {
        console.error('Error fetching school name:', error);
      }
    };
    fetchSchoolName();
  }, []);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Navbar />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {user && <Sidebar />}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            ...(user && { width: `calc(100% - 240px)` })
          }}
        >
          <Toolbar />
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// Root Redirect component
const RootRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'parent') return <Navigate to="/parent/dashboard" replace />;
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<RootRedirect />} />

              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/teachers" element={<ManageTeachers />} />
                <Route path="/admin/attendance" element={<UpdateAttendance />} />
                <Route path="/admin/reports" element={<AdminReports />} />
              </Route>

              {/* Parent Routes */}
              <Route element={<ProtectedRoute allowedRoles={['parent']} />}>
                <Route path="/parent/dashboard" element={<ParentDashboard />} />
                <Route path="/parent/attendance" element={<ViewAttendance />} />
                <Route path="/parent/report" element={<SubmitReport />} />
              </Route>

              {/* Fallback routing */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
