import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Toolbar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const Sidebar = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const adminLinks = [
    { text: 'Admin Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
    { text: 'Manage Teachers', path: '/admin/teachers', icon: <PeopleIcon /> },
    { text: 'Update Attendance', path: '/admin/attendance', icon: <EventAvailableIcon /> },
    { text: 'Reports', path: '/admin/reports', icon: <ReportProblemIcon /> },
  ];

  const parentLinks = [
    { text: 'Parent Dashboard', path: '/parent/dashboard', icon: <DashboardIcon /> },
    { text: 'View Attendance', path: '/parent/attendance', icon: <AssignmentIcon /> },
    { text: 'Submit Report', path: '/parent/report', icon: <ReportProblemIcon /> },
  ];

  const links = user?.role === 'admin' ? adminLinks : parentLinks;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar /> {/* Spacer for Navbar */}
      <Box sx={{ overflow: 'auto', mt: 2 }}>
        <List>
          {links.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: '0 24px 24px 0',
                  mr: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    color: 'white',
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                    '&:hover': {
                      backgroundColor: 'primary.main',
                    }
                  },
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.path ? 'white' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={t(item.text)} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
