import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import api from '../../api/axiosInstance';
import PeopleIcon from '@mui/icons-material/People';
import MessageIcon from '@mui/icons-material/Message';
import WarningIcon from '@mui/icons-material/Warning';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const DoctorDashboard = () => {
  const [stats, setStats] = useState({
    activePatients: 0,
    unreadMessages: 0,
    totalSideEffects: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const patientsRes = await api.get('/Doctor/patients');
      const patients = patientsRes.data || [];

      let unreadCount = 0;
      let sideEffectsCount = 0;

      if (user?.userId) {
        try {
          const unreadRes = await api.get(`/Message/unread/${user.userId}`);
          unreadCount = unreadRes.data.length || 0;
        } catch (err) {
          console.log('No unread messages');
        }
      }

      for (const patient of patients) {
        try {
          const sideEffectsRes = await api.get(`/SideEffect/list/${patient.id}`);
          sideEffectsCount += sideEffectsRes.data.length || 0;
        } catch (err) {
          console.log(`No side effects for patient ${patient.id}`);
        }
      }

      setStats({
        activePatients: patients.length,
        unreadMessages: unreadCount,
        totalSideEffects: sideEffectsCount,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Çalışma alanınız yükleniyor..." />;
  }

  const getGreeting = () => {
    return 'Merhabalar';
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
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
        <Container maxWidth={false} sx={{ position: 'relative', zIndex: 1, px: { xs: 2, md: 4 } }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            {getGreeting()}, {user?.name || 'Doktor'}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95 }}>
            İşte günlük genel bakışınız
          </Typography>
        </Container>
      </Box>

      {/* Stats Grid */}
      <Container maxWidth={false} sx={{ mb: 4, px: { xs: 2, md: 4 } }}>
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
              title="Aktif Hastalar"
              value={stats.activePatients}
              icon={PeopleIcon}
              color="primary"
              action={() => navigate('/doctor/patients')}
              actionLabel="Hastaları Görüntüle"
            />
          </Box>

          <Box sx={{ flex: 1, minHeight: 220 }}>
            <StatCard
              title="Okunmamış Mesajlar"
              value={stats.unreadMessages}
              icon={MessageIcon}
              color="info"
              action={() => navigate('/doctor/patients')}
              actionLabel="Mesajları Görüntüle"
            />
          </Box>

          <Box sx={{ flex: 1, minHeight: 220 }}>
            <StatCard
              title="Bildirilen Yan Etkiler"
              value={stats.totalSideEffects}
              icon={WarningIcon}
              color="warning"
              action={() => navigate('/doctor/patients')}
              actionLabel="Raporları İncele"
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default DoctorDashboard;