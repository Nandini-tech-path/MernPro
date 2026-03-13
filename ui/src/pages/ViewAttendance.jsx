import React, { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const ViewAttendance = () => {
  const { t } = useTranslation();
  const dateStr = new Date().toLocaleDateString();

  // Mock Data
  const [attendance] = useState([
    { id: 1, name: 'John Doe', subject: 'Mathematics', status: 'Present' },
    { id: 2, name: 'Jane Smith', subject: 'Science', status: 'Absent' },
  ]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {t('View Attendance')}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {dateStr}
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#F3F4F6' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Teacher Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendance.map((record) => (
              <TableRow key={record.id} hover>
                <TableCell>{record.name}</TableCell>
                <TableCell>{record.subject}</TableCell>
                <TableCell align="right">
                  <Chip 
                    label={record.status} 
                    color={record.status === 'Present' ? 'success' : 'error'} 
                    size="small"
                    icon={record.status === 'Present' ? <CheckCircleIcon /> : <CancelIcon />}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ViewAttendance;
