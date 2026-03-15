import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Box, Typography, Alert, Card, Chip, Select, MenuItem,
  FormControl, InputLabel, useTheme, alpha,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import MedicationIcon from '@mui/icons-material/Medication';
import api from '../../api/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const severityMap = { Mild: 'Hafif', Moderate: 'Orta', Severe: 'Ağır' };

const SideEffects = ({ patientId }) => {
  const theme = useTheme();
  const [sideEffects, setSideEffects] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  const [formData, setFormData] = useState({
    medicationId: '',
    description: '',
    severity: 'Mild',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchAll();
  }, [patientId]);

  const fetchAll = async () => {
    try {
      const [seRes, medRes] = await Promise.all([
        api.get(`/SideEffect/list/${patientId}`),
        api.get(`/Medication/list/${patientId}`),
      ]);
      setSideEffects(seRes.data || []);
      setMedications(medRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({ medicationId: '', description: '', severity: 'Mild', date: new Date().toISOString().split('T')[0] });
    setError('');
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!formData.description.trim()) { setError('Açıklama zorunludur.'); return; }
    try {
      await api.post('/SideEffect/report', {
        patientId: parseInt(patientId),
        medicationId: formData.medicationId ? parseInt(formData.medicationId) : null,
        description: formData.description,
        severity: formData.severity,
        date: new Date(formData.date).toISOString(),
      });
      setMsg('Yan etki kaydedildi.');
      await fetchAll();
      setOpenDialog(false);
    } catch (e) {
      setError(e.response?.data?.message || 'Kaydedilemedi.');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/SideEffect/${deleteDialog.id}`);
      setMsg('Yan etki silindi.');
      await fetchAll();
    } catch { setError('Silinemedi.'); }
    finally { setDeleteDialog({ open: false, id: null }); }
  };

  const getSeverityStyles = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'mild': return { bgcolor: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main };
      case 'moderate': return { bgcolor: alpha(theme.palette.warning.main, 0.1), color: theme.palette.warning.dark };
      case 'severe': return { bgcolor: alpha(theme.palette.error.main, 0.1), color: theme.palette.error.main };
      default: return { bgcolor: alpha(theme.palette.grey[500], 0.1), color: theme.palette.grey[600] };
    }
  };

  if (loading) return <LoadingSpinner text="Yan etkiler yükleniyor..." />;

  return (
    <Card sx={{ borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, background: 'white' }}>
        <Typography variant="h6" fontWeight={700}>Yan Etkiler ({sideEffects.length})</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}
          sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)', boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}
        >
          Yan Etki Ekle
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ m: 2, borderRadius: '12px' }} onClose={() => setError('')}>{error}</Alert>}
      {msg && <Alert severity="success" sx={{ m: 2, borderRadius: '12px' }} onClose={() => setMsg('')}>{msg}</Alert>}

      {sideEffects.length === 0 ? (
        <Box py={6}><EmptyState message="Yan etki bildirilmedi" icon={WarningIcon} action={{ label: 'Yan Etki Ekle', onClick: handleAdd }} /></Box>
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
              {sideEffects.map(effect => (
                <TableRow key={effect.id} sx={{ '&:hover': { background: alpha(theme.palette.primary.main, 0.02) }, transition: 'background 0.2s' }}>
                  <TableCell><Typography variant="body2" color="text.secondary">{new Date(effect.date || effect.createdAt).toLocaleDateString('tr-TR')}</Typography></TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <MedicationIcon sx={{ color: theme.palette.primary.main, fontSize: 18 }} />
                      <Typography variant="body2" fontWeight={500}>{effect.medication?.name || 'Belirtilmemiş'}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell><Typography variant="body2" sx={{ maxWidth: 300 }}>{effect.description}</Typography></TableCell>
                  <TableCell>
                    <Chip
                      icon={<WarningIcon sx={{ fontSize: 16 }} />}
                      label={severityMap[effect.severity] || effect.severity || 'Bilinmiyor'}
                      size="small"
                      sx={{ ...getSeverityStyles(effect.severity), fontWeight: 600, borderRadius: '8px', '& .MuiChip-icon': { color: 'inherit' } }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small"
                      onClick={() => setDeleteDialog({ open: true, id: effect.id })}
                      sx={{ color: theme.palette.error.main, bgcolor: alpha(theme.palette.error.main, 0.1), '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) } }}
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

      {/* Add Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h5" fontWeight={700}>Yan Etki Ekle</Typography>
          <IconButton onClick={() => setOpenDialog(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>{error}</Alert>}
          <Box display="flex" flexDirection="column" gap={2.5} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>İlaç (isteğe bağlı)</InputLabel>
              <Select
                value={formData.medicationId}
                onChange={e => setFormData({ ...formData, medicationId: e.target.value })}
                label="İlaç (isteğe bağlı)"
                sx={{ borderRadius: '12px' }}
              >
                <MenuItem value="">Belirtilmemiş</MenuItem>
                {medications.map(m => <MenuItem key={m.id} value={m.id}>{m.name} – {m.dose}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Şiddet</InputLabel>
              <Select
                value={formData.severity}
                onChange={e => setFormData({ ...formData, severity: e.target.value })}
                label="Şiddet"
                sx={{ borderRadius: '12px' }}
              >
                <MenuItem value="Mild">Hafif</MenuItem>
                <MenuItem value="Moderate">Orta</MenuItem>
                <MenuItem value="Severe">Ağır</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Tarih" type="date" value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              fullWidth InputLabelProps={{ shrink: true }} InputProps={{ sx: { borderRadius: '12px' } }}
            />
            <TextField label="Açıklama" value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              fullWidth required multiline rows={3}
              placeholder="Yan etki belirtilerini açıklayın..."
              InputProps={{ sx: { borderRadius: '12px' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ borderRadius: '10px', color: 'text.secondary' }}>İptal</Button>
          <Button onClick={handleSubmit} variant="contained"
            sx={{ borderRadius: '10px', px: 4, background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)' }}
          >Kaydet</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })} PaperProps={{ sx: { borderRadius: '20px', p: 1 } }} maxWidth="xs" fullWidth>
        <DialogTitle><Typography variant="h6" fontWeight={700}>Yan Etkiyi Sil</Typography></DialogTitle>
        <DialogContent><Typography color="text.secondary">Bu yan etki kaydını silmek istediğinize emin misiniz?</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })} sx={{ borderRadius: '10px', color: 'text.secondary' }}>Vazgeç</Button>
          <Button onClick={handleDelete} variant="contained" color="error" sx={{ borderRadius: '10px', px: 3 }}>Evet, Sil</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default SideEffects;