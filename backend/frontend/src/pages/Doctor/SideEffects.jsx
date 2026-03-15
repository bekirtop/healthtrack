import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Typography,
  Chip,
  Alert,
  Card,
  useTheme,
  alpha,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import MedicationIcon from '@mui/icons-material/Medication';
import api from '../../api/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const SideEffects = ({ patientId }) => {
  const theme = useTheme();
  const [sideEffects, setSideEffects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSideEffects();
  }, [patientId]);

  const fetchSideEffects = async () => {
    try {
      const response = await api.get(`/SideEffect/list/${patientId}`);
      setSideEffects(response.data || []);
    } catch (error) {
      console.error('Error fetching side effects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this side effect report?')) {
      try {
        await api.delete(`/SideEffect/${id}`);
        fetchSideEffects();
      } catch (error) {
        console.error('Error deleting side effect:', error);
        setError('Yan etki silinemedi');
      }
    }
  };

  const getSeverityStyles = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'mild':
        return {
          bgcolor: alpha(theme.palette.success.main, 0.1),
          color: theme.palette.success.main,
        };
      case 'moderate':
        return {
          bgcolor: alpha(theme.palette.warning.main, 0.1),
          color: theme.palette.warning.dark,
        };
      case 'severe':
        return {
          bgcolor: alpha(theme.palette.error.main, 0.1),
          color: theme.palette.error.main,
        };
      default:
        return {
          bgcolor: alpha(theme.palette.grey[500], 0.1),
          color: theme.palette.grey[600],
        };
    }
  };

  if (loading) {
    return <LoadingSpinner text="Yan etkiler yükleniyor..." />;
  }

  return (
    <Card
      sx={{
        borderRadius: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.05)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          background: 'white',
        }}
      >
        <Typography variant="h6" fontWeight={700} color="text.primary">
          Yan Etkiler ({sideEffects.length})
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ m: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {sideEffects.length === 0 ? (
        <Box py={6}>
          <EmptyState
            message="Yan etki bildirilmedi"
            icon={WarningIcon}
          />
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: '#F9FAFB' }}>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Tarih</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>İlaç</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Açıklama</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Şiddet</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sideEffects.map((effect) => (
                <TableRow
                  key={effect.id}
                  sx={{
                    '&:hover': {
                      background: alpha(theme.palette.primary.main, 0.02),
                    },
                    transition: 'background 0.2s',
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(effect.date || effect.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <MedicationIcon sx={{ color: theme.palette.primary.main, fontSize: 18 }} />
                      <Typography variant="body2" fontWeight={500}>
                        {effect.medication?.name || 'Belirtilmemiş'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 300 }}>
                      {effect.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<WarningIcon sx={{ fontSize: 16 }} />}
                      label={effect.severity || 'Bilinmiyor'}
                      size="small"
                      sx={{
                        ...getSeverityStyles(effect.severity),
                        fontWeight: 600,
                        borderRadius: '8px',
                        '& .MuiChip-icon': {
                          color: 'inherit',
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      sx={{
                        color: theme.palette.error.main,
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) },
                      }}
                      onClick={() => handleDelete(effect.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Card>
  );
};

export default SideEffects;