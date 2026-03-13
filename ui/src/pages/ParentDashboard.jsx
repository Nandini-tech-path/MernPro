import React from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

const ParentDashboard = () => {
  const { t } = useTranslation();

  const stats = [
    { title: 'Days Checked', value: '14', icon: <AssignmentIcon fontSize="large" color="primary" />, color: '#E0E7FF' },
    { title: 'Reports Filed', value: '1', icon: <ReportProblemIcon fontSize="large" color="warning" />, color: '#FEF3C7' },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: 'text.primary' }}>
        {t('Parent Dashboard')}
      </Typography>

      <Grid container spacing={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} key={index}>
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
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Important Notices</Typography>
          <Typography variant="body2" color="text.secondary">
            School will remain closed on upcoming Friday due to a public holiday.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default ParentDashboard;
