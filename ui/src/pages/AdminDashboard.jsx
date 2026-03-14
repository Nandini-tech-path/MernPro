import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent, TextField, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import PeopleIcon from '@mui/icons-material/People';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [schoolName, setSchoolName] = useState(user?.schoolName || '');
  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState('');
  const [activity, setActivity] = useState([]);
  const [stats, setStats] = useState([
    { title: 'Total Teachers', value: '0', icon: <PeopleIcon fontSize="large" color="primary" />, color: '#E0E7FF' },
    { title: 'Present Today', value: '0', icon: <EventAvailableIcon fontSize="large" color="success" />, color: '#D1FAE5' },
    { title: 'Open Reports', value: '0', icon: <ReportProblemIcon fontSize="large" color="error" />, color: '#FEE2E2' },
  ]);

  useEffect(() => {
    fetchData();
    fetchActivity();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Fetch stats
      const statsRes = await axios.get('http://localhost:5000/api/admin/stats', config);
      setStats([
        { title: 'Total Teachers', value: statsRes.data.totalTeachers.toString(), icon: <PeopleIcon fontSize="large" color="primary" />, color: '#E0E7FF' },
        { title: 'Present Today', value: statsRes.data.presentToday.toString(), icon: <EventAvailableIcon fontSize="large" color="success" />, color: '#D1FAE5' },
        { title: 'Open Reports', value: statsRes.data.openReports.toString(), icon: <ReportProblemIcon fontSize="large" color="error" />, color: '#FEE2E2' },
      ]);

      // Fetch school info (including notices)
      const schoolRes = await axios.get('http://localhost:5000/api/admin/school', config);
      setSchoolName(schoolRes.data.name);
      setNotices(schoolRes.data.notices || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchActivity = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:5000/api/admin/recent-activity', config);
      setActivity(res.data);
    } catch (error) {
      console.error('Error fetching activity:', error);
    }
  };

  const handleSaveSchoolSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/school', { 
        name: schoolName,
        notices: notices
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('School settings updated successfully!');
    } catch (error) {
      console.error('Error saving school settings:', error);
      alert('Failed to update school settings.');
    }
  };

  const addNotice = () => {
    if (newNotice.trim()) {
      setNotices([...notices, newNotice.trim()]);
      setNewNotice('');
    }
  };

  const removeNotice = (index) => {
    setNotices(notices.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: 'text.primary' }}>
        {schoolName} - {t('Admin Dashboard')}
      </Typography>

      <Grid container spacing={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card sx={{ borderRadius: 4, boxShadow: 2, display: 'flex', alignItems: 'center', p: 2 }}>
              <Box sx={{ backgroundColor: stat.color, p: 2, borderRadius: '50%', mr: 2 }}>
                {stat.icon}
              </Box>
              <CardContent sx={{ p: '0 !important' }}>
                <Typography color="text.secondary" variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {stat.title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 6 }}>
        <Paper sx={{ p: 4, borderRadius: 4, elevation: 1 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>School Settings & Notices</Typography>
          <TextField
            label="School Name"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            fullWidth
            sx={{ mb: 3 }}
          />
          
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Manage Important Notices</Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              placeholder="Enter new notice..."
              value={newNotice}
              onChange={(e) => setNewNotice(e.target.value)}
              fullWidth
              size="small"
            />
            <Button variant="outlined" onClick={addNotice}>Add</Button>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            {notices.map((notice, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, mb: 1, bgcolor: '#F9FAFB', borderRadius: 1 }}>
                <Typography variant="body2">{notice}</Typography>
                <Button size="small" color="error" onClick={() => removeNotice(index)}>Remove</Button>
              </Box>
            ))}
          </Box>
          
          <Button variant="contained" onClick={handleSaveSchoolSettings}>
            Save All Settings
          </Button>
        </Paper>
      </Box>
      
      <Box sx={{ mt: 6 }}>
        <Paper sx={{ p: 4, borderRadius: 4, elevation: 1 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Recent Activity</Typography>
          {activity.length > 0 ? (
            <Box>
              {activity.map((act) => (
                <Box key={act.id} sx={{ py: 1.5, borderBottom: '1px solid #ECEFF1', '&:last-child': { borderBottom: 'none' } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {act.type === 'attendance' ? 'Attendance Recorded' : 'New Report Filed'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(act.date).toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {act.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No recent activity recorded.
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
