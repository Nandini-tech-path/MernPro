import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Select, MenuItem, IconButton, Avatar } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1, 
        backgroundColor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box 
          component={Link} 
          to="/" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            textDecoration: 'none', 
            color: 'inherit',
            gap: 1.5
          }}
        >
          <img src="/logo.png" alt="EduTracker Logo" style={{ height: '32px' }} />
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: 'primary.main' }}>
            EduTracker
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Select
            value={i18n.language || 'en'}
            onChange={handleLanguageChange}
            size="small"
            sx={{
              height: '32px',
              fontSize: '0.875rem',
              '.MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
              backgroundColor: 'background.default',
              borderRadius: '20px',
              px: 1
            }}
          >
            <MenuItem value="en">EN</MenuItem>
            <MenuItem value="te">తెలుగు</MenuItem>
            <MenuItem value="hi">हिन्दी</MenuItem>
          </Select>

          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  @{user.username || user.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textTransform: 'capitalize' }}>
                  {user.role} {user.schoolName && `| ${user.schoolName}`}
                </Typography>
              </Box>
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  bgcolor: 'primary.light',
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              >
                {user.name.charAt(0)}
              </Avatar>
              <IconButton color="inherit" onClick={handleLogout} size="small" sx={{ ml: 1 }}>
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Button 
              component={Link} 
              to="/login" 
              variant="contained" 
              size="small"
              sx={{ borderRadius: '20px', px: 3 }}
            >
              {t('Login')}
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
