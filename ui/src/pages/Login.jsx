import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Container, Fade } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // TODO: Replace with real axios call to backend
      // const res = await axios.post('/api/auth/login', { email, password });
      
      // MOCK LOGIN FOR NOW
      if (email === 'admin@mail.com') {
        login({ id: 1, name: 'Admin User', role: 'admin', email }, 'mock-jwt-token-admin');
        navigate('/admin/dashboard');
      } else if (email === 'parent@mail.com') {
        login({ id: 2, name: 'Parent User', role: 'parent', email }, 'mock-jwt-token-parent');
        navigate('/parent/dashboard');
      } else {
        setError('Invalid credentials. Use admin@mail.com or parent@mail.com');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Fade in={true} timeout={800}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
              {t('Login')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              Welcome back to EduTracker. Please login to your account.
            </Typography>
            
            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label={t('Email')}
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ py: 1.5, mb: 2, borderRadius: 2 }}
              >
                {t('Login')}
              </Button>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2">
                  Don't have an account?{' '}
                  <Link to="/register" style={{ color: '#4F46E5', textDecoration: 'none', fontWeight: 'bold' }}>
                    {t('Register')}
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

export default Login;
