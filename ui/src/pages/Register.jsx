import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Container, Fade, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'parent',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Mock registration
      // const res = await axios.post('/api/auth/register', formData);
      console.log('Registered with', formData);
      navigate('/login');
    } catch (err) {
      setError('Registration failed.');
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Fade in={true} timeout={800}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
              {t('Register')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              Create an account on EduTracker.
            </Typography>

            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <Box component="form" onSubmit={handleRegister} sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={formData.name}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label={t('Email')}
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={t('Password')}
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                select
                margin="normal"
                required
                fullWidth
                name="role"
                label="Role"
                value={formData.role}
                onChange={handleChange}
                sx={{ mb: 3 }}
              >
                <MenuItem value="parent">Parent</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </TextField>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ py: 1.5, mb: 2, borderRadius: 2 }}
              >
                {t('Register')}
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2">
                  Already have an account?{' '}
                  <Link to="/login" style={{ color: '#4F46E5', textDecoration: 'none', fontWeight: 'bold' }}>
                    {t('Login')}
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default Register;
