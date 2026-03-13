import React, { useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const UpdateAttendance = () => {
  const { t } = useTranslation();
  const dateStr = new Date().toLocaleDateString();

  const [attendance, setAttendance] = useState([
    { id: 1, name: 'John Doe', status: 'Present' },
    { id: 2, name: 'Jane Smith', status: 'Absent' },
  ]);

  const toggleStatus = (id) => {
    setAttendance(attendance.map(t => 
      t.id === id ? { ...t, status: t.status === 'Present' ? 'Absent' : 'Present' } : t
    ));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {t('Update Attendance')}
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
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendance.map((record) => (
              <TableRow key={record.id} hover>
                <TableCell>{record.name}</TableCell>
                <TableCell>
                  <Chip 
                    label={record.status} 
                    color={record.status === 'Present' ? 'success' : 'error'} 
                    size="small"
                    icon={record.status === 'Present' ? <CheckCircleIcon /> : <CancelIcon />}
                  />
                </TableCell>
                <TableCell align="right">
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => toggleStatus(record.id)}
                  >
                    Toggle Status
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" size="large" sx={{ borderRadius: 2 }}>
          Save Attendance
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateAttendance;
