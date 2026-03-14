import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, MenuItem, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import SendIcon from '@mui/icons-material/Send';

const SubmitReport = () => {
  const { t } = useTranslation();

  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    teacherId: '',
    issue: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/parent/teachers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTeachers(response.data.teachers);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };
    fetchTeachers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.teacherId && formData.issue) {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/parent/reports', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess(true);
        setError('');
        setFormData({ teacherId: '', issue: '' });
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
        console.error('Error submitting report:', err);
        setError(err.response?.data?.message || 'Failed to submit report. Ensure issue is at least 10 characters.');
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        {t('Submit Report')}
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          If a teacher has been absent for a long period or you have concerns regarding attendance, please report it here. This will be reviewed directly by the administrators.
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Your report has been submitted successfully to the administration.
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            select
            fullWidth
            label="Select Teacher"
            value={formData.teacherId}
            onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
            sx={{ mb: 3 }}
            required
          >
            {teachers.map((teacher) => (
              <MenuItem key={teacher._id} value={teacher._id}>
                {teacher.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Describe the Issue"
            multiline
            rows={5}
            value={formData.issue}
            onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
            sx={{ mb: 3 }}
            required
            placeholder="e.g. Teacher has been absent for the past two weeks without any substitute..."
          />

          <Button 
            type="submit" 
            variant="contained" 
            size="large" 
            endIcon={<SendIcon />}
            sx={{ borderRadius: 2 }}
          >
            Submit Report
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SubmitReport;
