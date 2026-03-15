import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Tabs, Tab, Card, CardContent,
  Chip, Avatar, useTheme, alpha, Button,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import Medications from './Medications';
import SideEffects from './SideEffects';
import Messages from './Messages';
import Diagnoses from './Diagnoses';
import LoadingSpinner from '../../components/LoadingSpinner';
import PersonIcon from '@mui/icons-material/Person';
import MedicationIcon from '@mui/icons-material/Medication';
import WarningIcon from '@mui/icons-material/Warning';
import MessageIcon from '@mui/icons-material/Message';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PatientDetails = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchPatientDetails();
  }, [patientId]);

  const fetchPatientDetails = async () => {
    try {
      const [patientRes, diagRes] = await Promise.all([
        api.get(`/Patient/${patientId}`),
        api.get(`/PatientDiagnosis/${patientId}`).catch(() => ({ data: [] })),
      ]);
      setPatient(patientRes.data);
      setDiagnoses(diagRes.data || []);
    } catch (error) {
      console.error('Error fetching patient details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Hasta detayları yükleniyor..." />;

  if (!patient) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">Hasta bulunamadı</Typography>
      </Container>
    );
  }

  const tabItems = [
    { label: 'Tanılar', icon: <LocalHospitalIcon /> },
    { label: 'İlaçlar', icon: <MedicationIcon /> },
    { label: 'Yan Etkiler', icon: <WarningIcon /> },
    { label: 'Mesajlar', icon: <MessageIcon /> },
  ];

  const isActive = !patient.dischargeDate || new Date(patient.dischargeDate) > new Date();

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          color: 'white', py: 5, px: 3, mb: 4,
          borderRadius: '0 0 32px 32px',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 10px 40px -10px rgba(79, 70, 229, 0.5)',
        }}
      >
        <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        <Box sx={{ position: 'absolute', bottom: -30, left: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />

        <Container maxWidth={false} sx={{ position: 'relative', zIndex: 1, px: { xs: 2, md: 4 } }}>
          <Box onClick={() => navigate('/doctor/patients')} sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 3, cursor: 'pointer', opacity: 0.9, '&:hover': { opacity: 1 } }}>
            <ArrowBackIcon fontSize="small" />
            <Typography variant="body2">Hastalara Dön</Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', fontSize: '2rem', fontWeight: 700 }}>
              {patient.fullName?.charAt(0) || patient.user?.fullName?.charAt(0) || <PersonIcon sx={{ fontSize: 40 }} />}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h3" fontWeight={700} gutterBottom>
                {patient.fullName || patient.user?.fullName || 'Bilinmeyen Hasta'}
              </Typography>
              <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                <Typography variant="body1" sx={{ opacity: 0.9 }}>Hasta ID: #{patient.id}</Typography>
                <Chip
                  label={isActive ? 'Aktif Hasta' : 'Taburcu Edildi'}
                  size="small"
                  sx={{
                    bgcolor: isActive ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.2)',
                    color: 'white', fontWeight: 600,
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Info Cards */}
          <Box display="flex" gap={2} mt={4} flexWrap="wrap">
            {/* Diagnoses summary */}
            <Card sx={{ flex: 1, minWidth: 200, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px' }}>
              <CardContent>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Tanılar</Typography>
                {diagnoses.length === 0 ? (
                  <Typography variant="h6" fontWeight={600} color="white">Henüz tanı yok</Typography>
                ) : (
                  <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                    {diagnoses.slice(0, 3).map(d => (
                      <Chip key={d.id} label={d.diagnosis} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: 'white', fontWeight: 600, fontSize: '0.7rem' }} />
                    ))}
                    {diagnoses.length > 3 && (
                      <Chip label={`+${diagnoses.length - 3} daha`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem' }} />
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>

            {patient.dischargeDate && (
              <Card sx={{ flex: 1, minWidth: 200, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px' }}>
                <CardContent>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Taburcu Tarihi</Typography>
                  <Typography variant="h6" fontWeight={600} color="white">
                    {new Date(patient.dischargeDate).toLocaleDateString('tr-TR')}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth={false} sx={{ mb: 4, px: { xs: 2, md: 4 } }}>
        {/* Tabs */}
        <Card sx={{ borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="scrollable" scrollButtons="auto"
            sx={{
              px: 2,
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.95rem', minHeight: 64 },
              '& .Mui-selected': { color: theme.palette.primary.main },
              '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' },
            }}
          >
            {tabItems.map((item, i) => (
              <Tab key={i} label={item.label} icon={item.icon} iconPosition="start" />
            ))}
          </Tabs>
        </Card>

        {/* Tab Content */}
        <Box>
          {activeTab === 0 && <Diagnoses patientId={patientId} />}
          {activeTab === 1 && <Medications patientId={patientId} />}
          {activeTab === 2 && <SideEffects patientId={patientId} />}
          {activeTab === 3 && <Messages patientId={patientId} patient={patient} />}
        </Box>
      </Container>
    </Box>
  );
};

export default PatientDetails;