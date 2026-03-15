import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { keyframes } from '@mui/system';

// Floating animation for decorative icons
const float = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(username, password);

      if (result.success) {
        setTimeout(() => {
          const userRole = localStorage.getItem('role');
          if (userRole === 'Admin') {
            navigate('/admin/dashboard', { replace: true });
          } else if (userRole === 'Doctor') {
            navigate('/doctor/dashboard', { replace: true });
          }
        }, 100);
      } else {
        setError(result.error || 'Geçersiz kullanıcı adı veya şifre');
        setLoading(false);
      }
    } catch (error) {
      setError('Giriş sırasında bir hata oluştu');
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'var(--color-bg-primary)',
      }}
    >
      {/* Left Side - Gradient Hero */}
      <Box
        sx={{
          flex: 1,
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #06B6D4 100%)',
          position: 'relative',
          overflow: 'hidden',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 6,
        }}
      >
        {/* Decorative floating icons */}
        <Box
          sx={{
            position: 'absolute',
            top: '15%',
            left: '15%',
            animation: `${float} 6s ease-in-out infinite`,
            opacity: 0.3,
          }}
        >
          <LocalHospitalIcon sx={{ fontSize: 80, color: 'white' }} />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            right: '20%',
            animation: `${float} 8s ease-in-out infinite 1s`,
            opacity: 0.3,
          }}
        >
          <LocalHospitalIcon sx={{ fontSize: 100, color: 'white' }} />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: '40%',
            right: '10%',
            animation: `${float} 7s ease-in-out infinite 0.5s`,
            opacity: 0.2,
          }}
        >
          <LocalHospitalIcon sx={{ fontSize: 60, color: 'white' }} />
        </Box>

        {/* Content */}
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white' }}>
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            }}
          >
            <LocalHospitalIcon sx={{ fontSize: 60 }} />
          </Box>
          <Typography variant="h2" fontWeight={700} gutterBottom>
            HealthTrack
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95, maxWidth: 400, mx: 'auto' }}>
            Modern Hasta Yönetim Sistemi
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.85, mt: 2, maxWidth: 500, mx: 'auto' }}>
            Kapsamlı hasta takibi, ilaç yönetimi ve iletişim platformumuzla sağlık operasyonlarınızı kolaylaştırın.
          </Typography>
        </Box>
      </Box>

      {/* Right Side - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Box sx={{ maxWidth: 480, width: '100%', animation: 'fadeIn 0.8s ease-out' }}>
          {/* Mobile Logo */}
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                boxShadow: '0 8px 24px rgba(79, 70, 229, 0.3)',
              }}
            >
              <LocalHospitalIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              HealthTrack
            </Typography>
          </Box>

          <Card
            sx={{
              borderRadius: '24px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <CardContent sx={{ p: 5 }}>
              <Typography
                variant="h4"
                fontWeight={700}
                gutterBottom
                sx={{ color: 'text.primary' }}
              >
                Tekrar Hoş Geldiniz
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Hesabınıza devam etmek için giriş yapın
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  label="Kullanıcı Adı"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Şifre"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                    boxShadow: '0 8px 24px rgba(79, 70, 229, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4338CA 0%, #6D28D9 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 32px rgba(79, 70, 229, 0.4)',
                    },
                    '&:disabled': {
                      background: 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)',
                    },
                  }}
                >
                  {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                </Button>
              </form>

              {/* Login Info */}
              <Box
                sx={{
                  mt: 4,
                  p: 3,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
                  border: '1px solid rgba(79, 70, 229, 0.1)',
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  🔐 Kullanıcı adı ve şifrenizle giriş yapınız
                </Typography>
              </Box>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Hesabınız yok mu?{' '}
                  <Button
                    variant="text"
                    onClick={() => navigate('/register')}
                    sx={{
                      color: '#4F46E5',
                      textTransform: 'none',
                      fontWeight: 600,
                      p: 0,
                      minWidth: 'auto',
                      verticalAlign: 'baseline',
                      '&:hover': { background: 'transparent', textDecoration: 'underline' }
                    }}
                  >
                    Kayıt Olun
                  </Button>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;