import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const UpdateAttendance = () => {
  const { t } = useTranslation();
  const dateStr = new Date().toLocaleDateString();

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const teachersRes = await axios.get('http://localhost:5000/api/admin/teachers', config);
      const attendanceRes = await axios.get('http://localhost:5000/api/admin/attendance', config);
      
      // Merge teachers with attendance status
      const records = teachersRes.data.map(teacher => {
        const record = attendanceRes.data.find(a => a.teacher._id === teacher._id);
        return {
          _id: teacher._id,
          name: teacher.name,
          status: record ? record.status : 'Absent',
          attendanceId: record ? record._id : null
        };
      });
      
      setAttendance(records);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setLoading(false);
    }
  };

  const toggleStatus = (id) => {
    setAttendance(attendance.map(t => 
      t._id === id ? { ...t, status: t.status === 'Present' ? 'Absent' : 'Present' } : t
    ));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await Promise.all(attendance.map(record => 
        axios.post('http://localhost:5000/api/admin/attendance', {
          teacherId: record._id,
          status: record.status
        }, config)
      ));
      
      alert('Attendance saved successfully!');
      fetchData();
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Failed to save attendance.');
    }
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
              <TableRow key={record._id} hover>
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
                    onClick={() => toggleStatus(record._id)}
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
        <Button variant="contained" size="large" sx={{ borderRadius: 2 }} onClick={handleSave}>
          {t('Save Attendance')}
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateAttendance;
