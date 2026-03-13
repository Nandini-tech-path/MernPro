import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Toolbar } from '@mui/material';

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

// Main Layout Component
const AppLayout = ({ children }) => {
  const { user } = useAuth();
  
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Navbar />
      {user && <Sidebar />}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: '100%', 
          ...(user && { width: `calc(100% - 240px)` }) // Accommodate Sidebar width
        }}
      >
        <Toolbar /> {/* Spacer for Top Navbar */}
        {children}
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
