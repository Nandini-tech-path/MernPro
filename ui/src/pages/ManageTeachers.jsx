import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Dialog, 
  DialogTitle, DialogContent, DialogActions, TextField 
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const ManageTeachers = () => {
  const { t } = useTranslation();

  const [teachers, setTeachers] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    email: ''
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/teachers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', subject: '', email: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/teachers', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      handleClose();
      fetchTeachers();
    } catch (error) {
      console.error('Error adding teacher:', error);
      alert(error.response?.data?.message || 'Failed to add teacher');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/admin/teachers/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTeachers();
      } catch (error) {
        console.error('Error deleting teacher:', error);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {t('Manage Teachers')}
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: 2 }} onClick={handleOpen}>
          Add Teacher
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: 'primary.light' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Subject</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher._id} hover>
                <TableCell>{teacher.name}</TableCell>
                <TableCell>{teacher.subject}</TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" size="small" onClick={() => handleDelete(teacher._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Teacher Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add New Teacher</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              name="name"
              label="Full Name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              name="subject"
              label="Subject"
              fullWidth
              value={formData.subject}
              onChange={handleChange}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              name="email"
              label="Email Address"
              fullWidth
              type="email"
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button onClick={handleAddTeacher} variant="contained" disabled={!formData.name || !formData.subject || !formData.email}>
            Add Teacher
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageTeachers;
