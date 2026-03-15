import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
  Chip,
  Card,
  Avatar,
  TextField,
  InputAdornment,
  useTheme,
  alpha,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
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

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await api.get('/Doctor/patients');
      setPatients(response.data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusChip = (dischargeDate) => {
    if (!dischargeDate) {
      return (
        <Chip
          label="Aktif"
          size="small"
          sx={{
            bgcolor: alpha(theme.palette.success.main, 0.1),
            color: theme.palette.success.main,
            fontWeight: 600,
            borderRadius: '8px',
          }}
        />
      );
    }
    const daysSinceDischarge = Math.floor(
      (new Date() - new Date(dischargeDate)) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceDischarge <= 7) {
      return (
        <Chip
          label="Yakında Taburcu"
          size="small"
          sx={{
            bgcolor: alpha(theme.palette.warning.main, 0.1),
            color: theme.palette.warning.dark,
            fontWeight: 500,
            borderRadius: '8px',
          }}
        />
      );
    }
    return (
      <Chip
        label="Taburcu Sonrası"
        size="small"
        sx={{
          bgcolor: alpha(theme.palette.info.main, 0.1),
          color: theme.palette.info.main,
          fontWeight: 500,
          borderRadius: '8px',
        }}
      />
    );
  };

  const filteredPatients = patients.filter(p =>
    (p.fullName || p.user?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.diagnosis || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner text="Hastalar yükleniyor..." />;
  }

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
          boxShadow: '0 10px 40px -10px rgba(20, 184, 166, 0.5)',
        }}
      >
        {/* Decorative circles */}
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
            Hastalarım
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95 }}>
            Size atanan hastaları yönetin ve takip edin
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth={false} sx={{ mb: 4, px: { xs: 2, md: 4 } }}>
        <Card
          sx={{
            borderRadius: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.05)',
            overflow: 'hidden',
          }}
        >
          {/* Table Header / Toolbar */}
          <Box
            sx={{
              p: 3,
              borderBottom: '1px solid rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              background: 'white',
            }}
          >
            <Typography variant="h6" fontWeight={700} color="text.primary">
              Tüm Hastalar ({filteredPatients.length})
            </Typography>
            <TextField
              placeholder="Hasta veya tanı ara..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: { xs: '100%', sm: 300 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: '#F9FAFB',
                  '& fieldset': { border: 'none' },
                  '&:hover fieldset': { border: '1px solid #E5E7EB' },
                  '&.Mui-focused fieldset': { border: '1px solid #14B8A6' },
                },
              }}
            />
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#F9FAFB' }}>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Hasta</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Tanı</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Taburcu Tarihi</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Durum</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <TableRow
                      key={patient.id}
                      sx={{
                        '&:hover': {
                          background: alpha(theme.palette.primary.main, 0.02),
                        },
                        transition: 'background 0.2s',
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            sx={{
                              bgcolor: alpha(theme.palette.secondary.main, 0.1),
                              color: theme.palette.secondary.main,
                              width: 40,
                              height: 40,
                            }}
                          >
                            {(patient.fullName || patient.user?.fullName || 'P').charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {patient.fullName || patient.user?.fullName || patient.user?.username || 'Unknown'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: #{patient.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {patient.diagnosis ? (
                          <Chip
                            label={patient.diagnosis}
                            size="small"
                            sx={{
                              bgcolor: alpha(theme.palette.warning.main, 0.1),
                              color: theme.palette.warning.dark,
                              fontWeight: 500,
                              borderRadius: '8px',
                              maxWidth: 200,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            {patient.diagnosis || 'Belirtilmemiş'}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {patient.dischargeDate
                            ? new Date(patient.dischargeDate).toLocaleDateString()
                            : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>{getStatusChip(patient.dischargeDate)}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => navigate(`/doctor/patient/${patient.id}`)}
                          sx={{
                            borderRadius: '10px',
                            textTransform: 'none',
                            fontWeight: 600,
                            background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
                            boxShadow: '0 4px 12px rgba(20, 184, 166, 0.3)',
                            '&:hover': {
                              boxShadow: '0 6px 16px rgba(20, 184, 166, 0.4)',
                            },
                          }}
                        >
                          Detayları Görüntüle
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <EmptyState
                        message={searchTerm ? "Aramanızla eşleşen hasta bulunamadı" : "Henüz hasta atanmadı"}
                        icon={PersonIcon}
                      />
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
