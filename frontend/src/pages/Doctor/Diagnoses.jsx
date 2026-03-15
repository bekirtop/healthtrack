import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert, Card, useTheme, alpha, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import api from '../../api/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const Diagnoses = ({ patientId }) => {
  const theme = useTheme();
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  const [formData, setFormData] = useState({
    diagnosis: '',
    notes: '',
    diagnosedAt: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchDiagnoses();
  }, [patientId]);

  const fetchDiagnoses = async () => {
    try {
      const res = await api.get(`/PatientDiagnosis/${patientId}`);
      setDiagnoses(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditTarget(null);
    setFormData({ diagnosis: '', notes: '', diagnosedAt: new Date().toISOString().split('T')[0] });
    setError('');
    setOpenDialog(true);
  };

  const openEdit = (d) => {
    setEditTarget(d);
    setFormData({
      diagnosis: d.diagnosis,
      notes: d.notes || '',
      diagnosedAt: new Date(d.diagnosedAt).toISOString().split('T')[0],
    });
    setError('');
    setOpenDialog(true);
  };

  const handleSave = async () => {
    if (!formData.diagnosis.trim()) {
      setError('Tanı açıklaması zorunludur.');
      return;
    }
    try {
      const payload = {
        patientId: parseInt(patientId),
        diagnosis: formData.diagnosis,
        notes: formData.notes,
        diagnosedAt: new Date(formData.diagnosedAt).toISOString(),
      };
      if (editTarget) {
        await api.put(`/PatientDiagnosis/${editTarget.id}`, payload);
        setMsg('Tanı güncellendi.');
      } else {
        await api.post('/PatientDiagnosis', payload);
        setMsg('Yeni tanı eklendi.');
      }
      await fetchDiagnoses();
      setOpenDialog(false);
    } catch (e) {
      setError(e.response?.data?.message || 'Kayıt başarısız.');
    }
  };

  const confirmDelete = (id) => setDeleteDialog({ open: true, id });

  const handleDelete = async () => {
    try {
      await api.delete(`/PatientDiagnosis/${deleteDialog.id}`);
      setMsg('Tanı silindi.');
      await fetchDiagnoses();
    } catch {
      setError('Tanı silinemedi.');
    } finally {
      setDeleteDialog({ open: false, id: null });
    }
  };

  if (loading) return <LoadingSpinner text="Tanılar yükleniyor..." />;

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
          flexWrap: 'wrap', gap: 2,
          background: 'white',
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            Tanılar ({diagnoses.length})
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Hastanın tüm tanı geçmişi
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAdd}
          sx={{
            borderRadius: '12px', textTransform: 'none', fontWeight: 600,
            background: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
          }}
        >
          Tanı Ekle
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ m: 2, borderRadius: '12px' }} onClose={() => setError('')}>{error}</Alert>}
      {msg && <Alert severity="success" sx={{ m: 2, borderRadius: '12px' }} onClose={() => setMsg('')}>{msg}</Alert>}

      {/* Content */}
      {diagnoses.length === 0 ? (
        <Box py={6}>
          <EmptyState
            message="Henüz tanı eklenmemiş"
            icon={LocalHospitalIcon}
            action={{ label: 'İlk Tanıyı Ekle', onClick: openAdd }}
          />
        </Box>
      ) : (
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {diagnoses.map((d, idx) => (
              <Box
                key={d.id}
                sx={{
                  p: 2.5,
                  borderRadius: '16px',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                  background: idx % 2 === 0
                    ? alpha(theme.palette.primary.main, 0.03)
                    : alpha('#0EA5E9', 0.03),
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.08)}`,
                  },
                }}
              >
                <Box display="flex" gap={2} flex={1}>
                  <Box
                    sx={{
                      width: 42, height: 42, borderRadius: '12px', flexShrink: 0,
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha('#0EA5E9', 0.15)} 100%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <LocalHospitalIcon sx={{ fontSize: 22, color: theme.palette.primary.main }} />
                  </Box>
                  <Box flex={1}>
                    <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                      {d.diagnosis}
                    </Typography>
                    {d.notes && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                        {d.notes}
                      </Typography>
                    )}
                    <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                      <CalendarTodayIcon sx={{ fontSize: 13, color: 'text.disabled' }} />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(d.diagnosedAt).toLocaleDateString('tr-TR', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box display="flex" gap={0.5}>
                  <Tooltip title="Düzenle">
                    <IconButton
                      size="small"
                      onClick={() => openEdit(d)}
                      sx={{
                        color: theme.palette.primary.main,
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.16) },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Sil">
                    <IconButton
                      size="small"
                      onClick={() => confirmDelete(d.id)}
                      sx={{
                        color: theme.palette.error.main,
                        bgcolor: alpha(theme.palette.error.main, 0.08),
                        '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.16) },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog} onClose={() => setOpenDialog(false)}
        maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: '24px', padding: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {editTarget ? 'Tanıyı Düzenle' : 'Yeni Tanı Ekle'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hastaya yeni bir tanı belgeleyin
            </Typography>
          </Box>
          <IconButton onClick={() => setOpenDialog(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>{error}</Alert>}
          <Box display="flex" flexDirection="column" gap={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Tanı" value={formData.diagnosis}
              onChange={e => setFormData({ ...formData, diagnosis: e.target.value })}
              fullWidth required multiline rows={2}
              placeholder="Örn: Tip 2 Diyabet, Hipertansiyon..."
              InputProps={{ sx: { borderRadius: '12px' } }}
            />
            <TextField
              label="Tanı Tarihi" type="date" value={formData.diagnosedAt}
              onChange={e => setFormData({ ...formData, diagnosedAt: e.target.value })}
              fullWidth InputLabelProps={{ shrink: true }}
              InputProps={{ sx: { borderRadius: '12px' } }}
            />
            <TextField
              label="Notlar (isteğe bağlı)" value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              fullWidth multiline rows={3}
              placeholder="Ek açıklamalar, tedavi notları..."
              InputProps={{ sx: { borderRadius: '12px' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ borderRadius: '10px', px: 3, color: 'text.secondary' }}>
            İptal
          </Button>
          <Button
            onClick={handleSave} variant="contained"
            sx={{
              borderRadius: '10px', px: 4, py: 1,
              background: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)',
            }}
          >
            {editTarget ? 'Değişiklikleri Kaydet' : 'Tanıyı Kaydet'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}
        PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
        maxWidth="xs" fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={700}>Tanıyı Sil</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            Bu tanıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })} sx={{ borderRadius: '10px', color: 'text.secondary' }}>
            Vazgeç
          </Button>
          <Button
            onClick={handleDelete} variant="contained" color="error"
            sx={{ borderRadius: '10px', px: 3 }}
          >
            Evet, Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default Diagnoses;
