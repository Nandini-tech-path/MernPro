import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Chip, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const AdminReports = () => {
  const { t } = useTranslation();

  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const resolveReport = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admin/reports/${id}/resolve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReports();
    } catch (error) {
      console.error('Error resolving report:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        {t('Reports')}
      </Typography>

      <Grid container spacing={3}>
        {reports.map((report) => (
          <Grid item xs={12} key={report._id}>
            <Card sx={{ borderRadius: 3, boxShadow: report.status === 'Pending' ? 3 : 1, borderLeft: report.status === 'Pending' ? '4px solid #F59E0B' : '4px solid #10B981' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Report against {report.teacher?.name || 'Unknown Teacher'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Submitted by: {report.parent?.name || 'Unknown Parent'} | Date: {new Date(report.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Chip 
                    label={report.status} 
                    color={report.status === 'Pending' ? 'warning' : 'success'} 
                  />
                </Box>
                <Typography variant="body1" sx={{ mb: 3, p: 2, backgroundColor: '#F9FAFB', borderRadius: 2 }}>
                  "{report.issue}"
                </Typography>
                
                {report.status === 'Pending' && (
                  <Button variant="contained" size="small" onClick={() => resolveReport(report._id)}>
                    Mark as Resolved
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminReports;
