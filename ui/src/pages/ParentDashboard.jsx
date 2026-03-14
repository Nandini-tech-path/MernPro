import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent, Alert, Chip, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ReportIcon from '@mui/icons-material/Report';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const ParentDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [stats, setStats] = useState([
    { title: 'Days Checked', value: '0', icon: <CalendarMonthIcon fontSize="large" color="primary" />, color: '#E0E7FF' },
    { title: 'Reports Filed', value: '0', icon: <ReportIcon fontSize="large" color="error" />, color: '#FEE2E2' },
  ]);

  useEffect(() => {
    fetchStats();
    fetchRecentReports();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/parent/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats([
        { title: 'Days Checked', value: response.data.daysChecked.toString(), icon: <CalendarMonthIcon fontSize="large" color="primary" />, color: '#E0E7FF' },
        { title: 'Reports Filed', value: response.data.reportsFiled.toString(), icon: <ReportIcon fontSize="large" color="error" />, color: '#FEE2E2' },
      ]);
      setNotices(response.data.notices || []);
    } catch (error) {
      console.error('Error fetching parent stats:', error);
    }
  };

  const fetchRecentReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/parent/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Assuming response.data is { reports: [...] }
      setRecentReports(response.data.reports.slice(0, 3));
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        {user?.schoolName} - {t('Parent Dashboard')}
      </Typography>

      <Grid container spacing={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card sx={{ borderRadius: 4, boxShadow: 2, display: 'flex', alignItems: 'center', p: 3 }}>
              <Box sx={{ backgroundColor: stat.color, p: 2, borderRadius: '50%', mr: 3 }}>
                {stat.icon}
              </Box>
              <CardContent sx={{ p: '0 !important' }}>
                <Typography color="text.secondary" variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {stat.title}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* Notices Section */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 4, borderRadius: 4, minHeight: 300 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              <NotificationsActiveIcon sx={{ mr: 1, color: 'orange' }} />
              Important Notices from {user?.schoolName}
            </Typography>
            {notices.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {notices.map((notice, index) => (
                  <Alert key={index} icon={false} severity="info" sx={{ borderRadius: 2, borderLeft: '5px solid #2196F3' }}>
                    {notice}
                  </Alert>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">No new notices at this time.</Typography>
            )}
          </Paper>
        </Grid>

        {/* My Recent Reports */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 4, borderRadius: 4, minHeight: 300 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              My Recent Reports
            </Typography>
            {recentReports.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentReports.map((report) => (
                  <Box key={report._id} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {report.teacher?.name}
                      </Typography>
                      <Chip 
                        label={report.status} 
                        size="small" 
                        color={report.status === 'Resolved' ? 'success' : 'warning'} 
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {report.issue}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">You haven't filed any reports yet.</Typography>
            )}
            <Button variant="text" fullWidth sx={{ mt: 2 }} href="/parent/report">
              File a new report
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ParentDashboard;
