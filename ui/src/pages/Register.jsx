import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Fade, 
  MenuItem, 
  Tabs, 
  Tab,
  FormControl,
  InputLabel,
  Select,
  Stack
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [roleTab, setRoleTab] = useState(0); // 0 for Parent, 1 for Admin
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    schoolName: '',
    customSchoolName: '',
    childName: '',
    childClass: '',
  });
  const [error, setError] = useState('');

  const schools = [
    'Greenwood High',
    'Oakridge International',
    'Delhi Public School',
    'St. Mary\'s Convent',
    'Other (Add My School)'
  ];

  const handleTabChange = (event, newValue) => {
    setRoleTab(newValue);
    setError('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const finalRole = roleTab === 0 ? 'parent' : 'admin';
      const finalSchool = formData.schoolName === 'Other (Add My School)' 
        ? formData.customSchoolName 
        : formData.schoolName;

      const submissionData = {
        name: roleTab === 0 ? formData.name : formData.username, // Using username as name for admin or formal name for parent
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: finalRole,
        schoolName: finalSchool,
        ...(roleTab === 0 && {
          childName: formData.childName,
          childClass: formData.childClass,
        })
      };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      console.log('Registered successfully', data);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    }
  };

  return (
    <Fade in={true} timeout={800}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 4, sm: 6 }, 
          width: '100%', 
          maxWidth: '560px',
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <img src="/logo.png" alt="EduTracker Logo" style={{ height: '40px', marginBottom: '16px' }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '-0.025em' }}>
              {t('Create EduTracker Account')}
            </Typography>
          </Box>
          
          <Tabs 
            value={roleTab} 
            onChange={handleTabChange} 
            variant="fullWidth"
            sx={{ 
              mb: 4, 
              width: '100%', 
              backgroundColor: 'background.default',
              borderRadius: '12px',
              p: 0.5,
              minHeight: '44px',
              '& .MuiTabs-indicator': {
                height: 'calc(100% - 8px)',
                borderRadius: '8px',
                backgroundColor: 'white',
                boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                m: '4px'
              },
              '& .MuiTab-root': {
                zIndex: 1,
                minHeight: '36px',
                fontSize: '0.875rem',
                '&.Mui-selected': { color: 'primary.main' }
              }
            }}
          >
            <Tab label="Parent" />
            <Tab label="Admin" />
          </Tabs>

          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 3, textAlign: 'center' }}>
              {error}
            </Typography>
          )}

          <Stack component="form" onSubmit={handleRegister} spacing={3} sx={{ width: '100%' }}>
            {roleTab === 0 && (
              <TextField
                required
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            )}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                required
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
              <TextField
                required
                fullWidth
                label={t('Email Address')}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                required
                fullWidth
                name="password"
                label={t('Password')}
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </Stack>

            <FormControl fullWidth required>
              <InputLabel id="school-label">School Name</InputLabel>
              <Select
                labelId="school-label"
                name="schoolName"
                value={formData.schoolName}
                label="School Name"
                onChange={handleChange}
              >
                {schools.map((school) => (
                  <MenuItem key={school} value={school}>{school}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {formData.schoolName === 'Other (Add My School)' && (
              <Fade in={true}>
                <TextField
                  required
                  fullWidth
                  label="Enter Your School Name"
                  name="customSchoolName"
                  value={formData.customSchoolName}
                  onChange={handleChange}
                />
              </Fade>
            )}

            {roleTab === 0 && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  required
                  fullWidth
                  label="Child's Name"
                  name="childName"
                  value={formData.childName}
                  onChange={handleChange}
                />
                <TextField
                  required
                  fullWidth
                  label="Child's Class"
                  name="childClass"
                  value={formData.childClass}
                  onChange={handleChange}
                />
              </Stack>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ py: 1.5, mt: 1, borderRadius: 2, fontSize: '0.95rem' }}
            >
              {t('Create Account')}
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {t('Already have an account?')}{' '}
                <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
                  {t('Sign In')}
                </Link>
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Fade>
  );
};

export default Register;
