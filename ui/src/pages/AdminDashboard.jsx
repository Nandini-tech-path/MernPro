import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent, TextField, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import PeopleIcon from '@mui/icons-material/People';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [schoolName, setSchoolName] = useState('');

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

  const handleSaveSchoolName = async () => {
    try {
      await axios.post('/api/admin/school', { name: schoolName });
      alert('School name updated successfully!');
    } catch (error) {
      console.error('Error saving school name:', error);
      alert('Failed to update school name.');
    }
  };

  const stats = [
    { title: 'Total Teachers', value: '24', icon: <PeopleIcon fontSize="large" color="primary" />, color: '#E0E7FF' },
    { title: 'Present Today', value: '22', icon: <EventAvailableIcon fontSize="large" color="success" />, color: '#D1FAE5' },
    { title: 'Open Reports', value: '3', icon: <ReportProblemIcon fontSize="large" color="error" />, color: '#FEE2E2' },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: 'text.primary' }}>
        {t('Admin Dashboard')}
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
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>School Settings</Typography>
          <TextField
            label="School Name"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleSaveSchoolName}>
            Save School Name
          </Button>
        </Paper>
      </Box>
      
      <Box sx={{ mt: 6 }}>
        <Paper sx={{ p: 4, borderRadius: 4, elevation: 1 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Recent Activity</Typography>
          <Typography variant="body2" color="text.secondary">
            [Placeholder for recent attendance logs or reports]
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
