import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Box, Button, Chip,
  Card, Avatar, TextField, InputAdornment, useTheme, alpha,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import api from '../../api/axiosInstance';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const DoctorPatients = () => {
  const theme = useTheme();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.userId) fetchPatients();
  }, [user]);

  const fetchPatients = async () => {
    try {
      // Find the doctor ID by userId, then fetch patients
      const docsRes = await api.get('/Doctor');
      const doctor = docsRes.data.find(d => d.userId === user.userId);
      
      let patientsData = [];
      if (doctor) {
        const patientsRes = await api.get(`/Doctor/${doctor.id}/patients`).catch(() => ({ data: [] }));
        patientsData = patientsRes.data || [];
      }
      setPatients(patientsData);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusChip = (dischargeDate) => {
    if (!dischargeDate) return <Chip label="Aktif" size="small" sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main, fontWeight: 600, borderRadius: '8px' }} />;
    const days = Math.floor((new Date() - new Date(dischargeDate)) / (1000 * 60 * 60 * 24));
    if (days <= 0) return <Chip label="Yakında Taburcu" size="small" sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.dark, fontWeight: 500, borderRadius: '8px' }} />;
    return <Chip label="Taburcu Sonrası" size="small" sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main, fontWeight: 500, borderRadius: '8px' }} />;
  };

  const filtered = patients.filter(p =>
    (p.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.patientDiagnosis || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner text="Hastalar yükleniyor..." />;

  return (
    <Box>
      <Box sx={{ background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)', color: 'white', py: 6, px: 3, mb: 4, borderRadius: '0 0 32px 32px', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 40px -10px rgba(20,184,166,0.5)' }}>
        <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        <Container maxWidth={false} sx={{ position: 'relative', zIndex: 1, px: { xs: 2, md: 4 } }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>Hastalarım</Typography>
          <Typography variant="h6" sx={{ opacity: 0.95 }}>Size atanan hastaları yönetin ve takip edin</Typography>
        </Container>
      </Box>

      <Container maxWidth={false} sx={{ mb: 4, px: { xs: 2, md: 4 } }}>
        <Card sx={{ borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, background: 'white' }}>
            <Typography variant="h6" fontWeight={700}>Tüm Hastalar ({filtered.length})</Typography>
            <TextField
              placeholder="Hasta veya tanı ara..." variant="outlined" size="small"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> }}
              sx={{ width: { xs: '100%', sm: 300 }, '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#F9FAFB', '& fieldset': { border: 'none' }, '&:hover fieldset': { border: '1px solid #E5E7EB' }, '&.Mui-focused fieldset': { border: '1px solid #14B8A6' } } }}
            />
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#F9FAFB' }}>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Hasta</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Tanı</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Atama Tarihi</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Durum</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length > 0 ? filtered.map(patient => (
                  <TableRow key={patient.patientId}
                    sx={{ '&:hover': { background: alpha(theme.palette.primary.main, 0.02) }, transition: 'background 0.2s' }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1), color: theme.palette.secondary.main, width: 40, height: 40 }}>
                          {(patient.patientName || 'P').charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>{patient.patientName}</Typography>
                          <Typography variant="caption" color="text.secondary">ID: #{patient.patientId}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {patient.patientDiagnosis ? (
                        <Chip label={patient.patientDiagnosis} size="small" sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.dark, fontWeight: 500, borderRadius: '8px', maxWidth: 200 }} />
                      ) : (
                        <Typography variant="body2" color="text.secondary">Belirtilmemiş</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {patient.assignedAt ? new Date(patient.assignedAt).toLocaleDateString('tr-TR') : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>{getStatusChip(patient.dischargeDate)}</TableCell>
                    <TableCell align="right">
                      <Button variant="contained" size="small" startIcon={<VisibilityIcon />}
                        onClick={() => navigate(`/doctor/patient/${patient.patientId}`)}
                        sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)', boxShadow: '0 4px 12px rgba(20,184,166,0.3)', '&:hover': { boxShadow: '0 6px 16px rgba(20,184,166,0.4)' } }}
                      >
                        Detayları Görüntüle
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <EmptyState message={searchTerm ? 'Aramanızla eşleşen hasta bulunamadı' : 'Henüz hasta atanmadı'} icon={PersonIcon} />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Container>
    </Box>
  );
};

export default DoctorPatients;
