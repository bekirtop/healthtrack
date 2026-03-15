import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AddIcon from '@mui/icons-material/Add';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    doctorCount: 0,
    patientCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [doctorsRes, patientsRes] = await Promise.all([
        api.get('/Doctor'),
        api.get('/Patient'),
      ]);

      setStats({
        doctorCount: doctorsRes.data.length || 0,
        patientCount: patientsRes.data.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          color: 'white',
          py: 6,
          px: 3,
          mb: 4,
          borderRadius: '0 0 32px 32px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
          }}
        />
        {/* Hero Content */}
        <Container maxWidth={false} sx={{ position: 'relative', zIndex: 1, px: { xs: 4, md: 18 } }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Yönetim Paneli
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95 }}>
            Doktorları, hastaları ve sistem genel görünümünü yönetin
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth={false} sx={{ mb: 4, px: { xs: 4, md: 18 } }}>
        {/* Stats Grid */}
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            mb: 4,
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Box sx={{ flex: 1, minHeight: 220 }}>
            <StatCard
              title="Toplam Doktor"
              value={stats.doctorCount}
              icon={LocalHospitalIcon}
              color="primary"
              action={() => navigate('/admin/doctors')}
              actionLabel="Doktorları Yönet"
            />
          </Box>
          <Box sx={{ flex: 1, minHeight: 220 }}>
            <StatCard
              title="Toplam Hasta"
              value={stats.patientCount}
              icon={PeopleIcon}
              color="secondary"
              action={() => navigate('/admin/patients')}
              actionLabel="Hastaları Yönet"
            />
          </Box>
          <Box sx={{ flex: 1, minHeight: 220 }}>
            <Box
              className="fade-in"
              sx={{
                minHeight: 220,
                height: '100%',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                borderRadius: '16px',
                p: 3,
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: 'fadeIn 0.6s ease-out',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)',
                },
              }}
            >
              {/* Decorative circles */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -30,
                  right: -30,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                }}
              />

              {/* Icon */}
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 'fit-content',
                  mb: 2,
                }}
              >
                <LocalHospitalIcon sx={{ fontSize: 32 }} />
              </Box>

              {/* Content */}
              <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5, zIndex: 1, color: 'white' }}>
                HealthTrack
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.95, zIndex: 1, color: 'white' }}>
                Hasta Takip Sistemi
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8, mt: 1, zIndex: 1, color: 'rgba(255,255,255,0.9)' }}>
                v1.0.2 • Modern Sağlık Platformu
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Quick Actions */}
        <Box
          sx={{
            p: 4,
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
          }}
        >
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Hızlı İşlemler
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Sık kullanılan yönetim görevleri
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/admin/doctors')}
              sx={{
                borderRadius: '12px',
                px: 3,
                py: 1.5,
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              }}
            >
              Yeni Doktor Ekle
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/admin/patients')}
              sx={{
                borderRadius: '12px',
                px: 3,
                py: 1.5,
                background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
              }}
            >
              Yeni Hasta Ekle
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminDashboard;