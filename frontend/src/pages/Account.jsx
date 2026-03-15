import React from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

const Account = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <AccountCircleIcon sx={{ fontSize: 60, mr: 2, color: 'primary.main' }} />
            <div>
              <Typography variant="h4">Account Information</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Manage your profile details
              </Typography>
            </div>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box mb={2}>
            <Typography variant="subtitle2" color="textSecondary">
              Full Name
            </Typography>
            <Typography variant="h6">{user?.fullName || 'N/A'}</Typography>
          </Box>

          <Box mb={2}>
            <Typography variant="subtitle2" color="textSecondary">
              Username
            </Typography>
            <Typography variant="h6">{user?.username || 'N/A'}</Typography>
          </Box>

          <Box mb={2}>
            <Typography variant="subtitle2" color="textSecondary">
              Role
            </Typography>
            <Typography variant="h6">{role || 'N/A'}</Typography>
          </Box>

          <Box mb={2}>
            <Typography variant="subtitle2" color="textSecondary">
              User ID
            </Typography>
            <Typography variant="h6">{user?.userId || 'N/A'}</Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            fullWidth
            size="large"
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Account;