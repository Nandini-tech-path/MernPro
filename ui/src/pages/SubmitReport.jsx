import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, MenuItem, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SendIcon from '@mui/icons-material/Send';

const SubmitReport = () => {
  const { t } = useTranslation();

  const teachers = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
  ];

  const [formData, setFormData] = useState({
    teacherId: '',
    issue: ''
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.teacherId && formData.issue) {
      // Mock submit
      setSuccess(true);
      setFormData({ teacherId: '', issue: '' });
      setTimeout(() => setSuccess(false), 3000);
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
              <MenuItem key={teacher.id} value={teacher.id}>
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
