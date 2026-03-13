import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Chip, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const AdminReports = () => {
  const { t } = useTranslation();

  const [reports, setReports] = useState([
    { id: 1, parentName: 'Alice Brown', teacherName: 'Jane Smith', date: '2023-10-25', status: 'Pending', issue: 'Teacher has been absent for 10 days straight without notice.' },
    { id: 2, parentName: 'Bob White', teacherName: 'John Doe', date: '2023-10-20', status: 'Resolved', issue: 'Substitute teacher poorly handling classes.' },
  ]);

  const resolveReport = (id) => {
    setReports(reports.map(r => r.id === id ? { ...r, status: 'Resolved' } : r));
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        {t('Reports')}
      </Typography>

      <Grid container spacing={3}>
        {reports.map((report) => (
          <Grid item xs={12} key={report.id}>
            <Card sx={{ borderRadius: 3, boxShadow: report.status === 'Pending' ? 3 : 1, borderLeft: report.status === 'Pending' ? '4px solid #F59E0B' : '4px solid #10B981' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Report against {report.teacherName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Submitted by: {report.parentName} | Date: {report.date}
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
                  <Button variant="contained" size="small" onClick={() => resolveReport(report.id)}>
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
