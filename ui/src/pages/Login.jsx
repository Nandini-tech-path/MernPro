import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Fade,
  Tabs,
  Tab,
  Link as MuiLink,
  Stack
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [roleTab, setRoleTab] = useState(0); // 0 for Parent, 1 for Admin
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleTabChange = (event, newValue) => {
    setRoleTab(newValue);
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (roleTab === 1 && email === 'admin@mail.com') {
        login({ id: 1, name: 'Admin User', role: 'admin', email }, 'mock-jwt-token-admin');
        navigate('/admin/dashboard');
      } else if (roleTab === 0 && email === 'parent@mail.com') {
        login({ id: 2, name: 'Parent User', role: 'parent', email }, 'mock-jwt-token-parent');
        navigate('/parent/dashboard');
      } else {
        const roleName = roleTab === 0 ? 'Parent' : 'Admin';
        setError(`Invalid ${roleName} credentials. Use ${roleTab === 0 ? 'parent@mail.com' : 'admin@mail.com'}`);
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <Fade in={true} timeout={800}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 4, sm: 6 }, 
          width: '100%', 
          maxWidth: '440px',
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
              {t('Login to EduTracker')}
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

          <Stack component="form" onSubmit={handleLogin} spacing={3} sx={{ width: '100%' }}>
            <TextField
              required
              fullWidth
              label={t('Email Address')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
            />
            <Box>
              <TextField
                required
                fullWidth
                label={t('Password')}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
              />
              {roleTab === 0 && (
                <Box sx={{ mt: 1, textAlign: 'right' }}>
                  <MuiLink 
                    component={Link} 
                    to="#" 
                    variant="body2" 
                    sx={{ 
                      color: 'primary.main', 
                      textDecoration: 'none', 
                      fontWeight: 600
                    }}
                  >
                    {t('Forgot password?')}
                  </MuiLink>
                </Box>
              )}
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ py: 1.5, borderRadius: 2, fontSize: '0.95rem' }}
            >
              {t('Sign In')}
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {t("Don't have an account?")}{' '}
                <Link to="/register" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
                  {t('Register now')}
                </Link>
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Fade>
  );
};

export default Login;
