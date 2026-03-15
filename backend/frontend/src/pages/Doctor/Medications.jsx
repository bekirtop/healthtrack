import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Typography,
  Alert,
  Card,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import MedicationIcon from '@mui/icons-material/Medication';
import api from '../../api/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const Medications = ({ patientId }) => {
  const theme = useTheme();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMedication, setCurrentMedication] = useState(null);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    dose: '',
    frequencyPerDay: '',
    durationDays: '',
    startDate: '',
    notes: '',
  });

  useEffect(() => {
    fetchMedications();
  }, [patientId]);

  const fetchMedications = async () => {
    try {
      const response = await api.get(`/Medication/list/${patientId}`);
      setMedications(response.data || []);
    } catch (error) {
      console.error('Error fetching medications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (medication = null) => {
    if (medication) {
      setEditMode(true);
      setCurrentMedication(medication);
      setFormData({
        name: medication.name || '',
        dose: medication.dose || '',
        frequencyPerDay: medication.frequencyPerDay || '',
        durationDays: medication.durationDays || '',
        startDate: medication.startDate
          ? new Date(medication.startDate).toISOString().split('T')[0]
          : '',
        notes: medication.notes || '',
      });
    } else {
      setEditMode(false);
      setCurrentMedication(null);
      setFormData({
        name: '',
        dose: '',
        frequencyPerDay: '',
        durationDays: '',
        startDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
    setOpenDialog(true);
    setError('');
    setMsg('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError('');
    setMsg('');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const start = new Date(formData.startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + (parseInt(formData.durationDays) || 30));

      const payload = {
        name: formData.name,
        dose: formData.dose,
        frequencyPerDay: parseInt(formData.frequencyPerDay) || 1,
        durationDays: parseInt(formData.durationDays) || 30,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        notes: formData.notes,
        patientId: parseInt(patientId),
      };

      if (editMode) {
        await api.put(`/Medication/${currentMedication.id}`, payload);
        setMsg('İlaç başarıyla güncellendi');
      } else {
        await api.post('/Medication', payload);
        setMsg('İlaç başarıyla eklendi');
      }

      fetchMedications();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving medication:', error);
      setError('İlaç kaydedilemedi');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      try {
        await api.delete(`/Medication/${id}`);
        fetchMedications();
      } catch (error) {
        console.error('Error deleting medication:', error);
        setError('İlaç silinemedi');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner text="İlaçlar yükleniyor..." />;
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          background: 'white',
        }}
      >
        <Typography variant="h6" fontWeight={700} color="text.primary">
          İlaçlar ({medications.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
          }}
        >
          İlaç Ekle
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ m: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {msg && (
        <Alert severity="success" sx={{ m: 2 }} onClose={() => setMsg('')}>
          {msg}
        </Alert>
      )}

      {medications.length === 0 ? (
        <Box py={6}>
          <EmptyState
            message="Henüz ilaç reçete edilmedi"
            icon={MedicationIcon}
            action={{ label: "İlk İlacı Ekle", onClick: () => handleOpenDialog() }}
          />
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: '#F9FAFB' }}>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>İlaç</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Doz</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Sıklık</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Süre</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Başlangıç Tarihi</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Notlar</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medications.map((med) => (
                <TableRow
                  key={med.id}
                  sx={{
                    '&:hover': {
                      background: alpha(theme.palette.primary.main, 0.02),
                    },
                    transition: 'background 0.2s',
                  }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <MedicationIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                      <Typography variant="subtitle2" fontWeight={600}>
                        {med.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={med.dose}
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: theme.palette.info.main,
                        fontWeight: 500,
                        borderRadius: '8px',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{med.frequencyPerDay}x/day</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{med.durationDays} gün</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(med.startDate).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {med.notes || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      sx={{
                        mr: 1,
                        color: theme.palette.primary.main,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) },
                      }}
                      onClick={() => handleOpenDialog(med)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{
                        color: theme.palette.error.main,
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) },
                      }}
                      onClick={() => handleDelete(med.id)}
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

      {/* Modern Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            padding: 1,
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h5" fontWeight={700}>
            {editMode ? 'İlacı Düzenle' : 'İlaç Ekle'}
          </Typography>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box component="form" display="flex" flexDirection="column" gap={2.5} sx={{ mt: 1 }}>
            <TextField
              label="İlaç Adı"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
              InputProps={{ sx: { borderRadius: '12px' } }}
            />
            <TextField
              label="Doz (örn: 500mg)"
              name="dose"
              value={formData.dose}
              onChange={handleInputChange}
              fullWidth
              required
              InputProps={{ sx: { borderRadius: '12px' } }}
            />
            <Box display="flex" gap={2}>
              <TextField
                label="Günlük Sıklık"
                name="frequencyPerDay"
                type="number"
                value={formData.frequencyPerDay}
                onChange={handleInputChange}
                fullWidth
                required
                InputProps={{ sx: { borderRadius: '12px' } }}
              />
              <TextField
                label="Süre (Gün)"
                name="durationDays"
                type="number"
                value={formData.durationDays}
                onChange={handleInputChange}
                fullWidth
                required
                InputProps={{ sx: { borderRadius: '12px' } }}
              />
            </Box>
            <TextField
              label="Başlangıç Tarihi"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: { borderRadius: '12px' } }}
            />
            <TextField
              label="Notlar"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={2}
              InputProps={{ sx: { borderRadius: '12px' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ borderRadius: '10px', px: 3, color: 'text.secondary' }}>
            İptal
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              borderRadius: '10px',
              px: 4,
              py: 1,
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            }}
          >
            {editMode ? 'Değişiklikleri Kaydet' : 'İlaç Ekle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default Medications;
