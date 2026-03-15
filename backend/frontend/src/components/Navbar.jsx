import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Chip
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const NavButton = ({ path, label, icon: Icon }) => (
    <Button
      onClick={() => navigate(path)}
      startIcon={Icon && <Icon />}
      sx={{
        color: isActive(path) ? 'primary.main' : 'text.primary',
        fontWeight: isActive(path) ? 700 : 500,
        textTransform: 'none',
        px: 2,
        py: 1,
        borderRadius: '10px',
        position: 'relative',
        transition: 'all 0.3s ease',
        background: isActive(path)
          ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)'
          : 'transparent',
        '&:hover': {
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%)',
          transform: 'translateY(-1px)',
        },
        '&::after': isActive(path) ? {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: '3px',
          borderRadius: '3px 3px 0 0',
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        } : {},
      }}
    >
      {label}
    </Button>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.3s ease',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        {/* Logo */}
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
            }}
          >
            <LocalHospitalIcon sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            HealthTrack
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {role === 'Admin' && (
            <>
              <NavButton path="/admin/dashboard" label="Panel" icon={DashboardIcon} />
              <NavButton path="/admin/doctors" label="Doktorlar" icon={MedicalServicesIcon} />
              <NavButton path="/admin/patients" label="Hastalar" icon={PeopleIcon} />
            </>
          )}

          {role === 'Doctor' && (
            <>
              <NavButton path="/doctor/dashboard" label="Panel" icon={DashboardIcon} />
              <NavButton path="/doctor/patients" label="Hastalarım" icon={PeopleIcon} />
            </>
          )}
        </Box>

        {/* User Actions */}
        <Box display="flex" alignItems="center" gap={2}>
          {/* User Info */}
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box textAlign="right" display={{ xs: 'none', sm: 'block' }}>
              <Typography variant="body2" fontWeight={600} color="text.primary">
                {user?.fullName || 'User'}
              </Typography>
              <Chip
                label={role}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                  color: 'primary.main',
                  border: '1px solid rgba(79, 70, 229, 0.2)',
                }}
              />
            </Box>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
              onClick={() => navigate('/account')}
            >
              <PersonIcon />
            </Avatar>
          </Box>

          {/* Logout Button */}
          <IconButton
            onClick={handleLogout}
            sx={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
              color: 'error.main',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)',
                transform: 'rotate(10deg) scale(1.1)',
              },
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;