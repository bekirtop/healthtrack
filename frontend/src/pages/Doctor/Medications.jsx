import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, IconButton, Collapse, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Box, Typography, Alert, Card, Chip, LinearProgress, useTheme, alpha,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MedicationIcon from '@mui/icons-material/Medication';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import api from '../../api/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const getMedStatus = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (now < start) return { label: 'Başlamadı', color: 'default' };
  if (now > end) return { label: 'Tamamlandı', color: 'success' };
  const total = end - start;
  const elapsed = now - start;
  const progress = Math.round((elapsed / total) * 100);
  return { label: 'Aktif', color: 'primary', progress };
};

const generateDoseTimes = (frequency) => {
  if (!frequency || frequency <= 0) return [];
  const times = [];
  const interval = 24 / frequency;
  const base = 8; // start at 08:00
  for (let i = 0; i < frequency; i++) {
    const hour = Math.round((base + i * interval) % 24);
    times.push(`${String(hour).padStart(2, '0')}:00`);
  }
  return times;
};

const Medications = ({ patientId }) => {
  const theme = useTheme();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentMedication, setCurrentMedication] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  const [formData, setFormData] = useState({
    name: '', dose: '', frequencyPerDay: '', durationDays: '', startDate: '', notes: '',
    doseTimes: [], // New state for custom times
  });

  useEffect(() => { fetchMedications(); }, [patientId]);

  // Update doseTimes when frequency changes
  useEffect(() => {
    const freq = parseInt(formData.frequencyPerDay) || 0;
    if (freq !== formData.doseTimes.length) {
      const newTimes = [...formData.doseTimes];
      if (freq > newTimes.length) {
        // Add default times
        const defaultTimes = generateDoseTimes(freq);
        for (let i = newTimes.length; i < freq; i++) {
          newTimes.push(defaultTimes[i] || '08:00');
        }
      } else {
        // Remove extra times
        newTimes.splice(freq);
      }
      setFormData(prev => ({ ...prev, doseTimes: newTimes }));
    }
  }, [formData.frequencyPerDay]);

  const fetchMedications = async () => {
    try {
      const res = await api.get(`/Medication/list/${patientId}`);
      setMedications(res.data || []);
    } catch { /* noop */ }
    finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditMode(false); setCurrentMedication(null);
    setFormData({ 
      name: '', dose: '', frequencyPerDay: '', durationDays: '', 
      startDate: new Date().toISOString().split('T')[0], notes: '',
      doseTimes: [] 
    });
    setError(''); setOpenDialog(true);
  };

  const openEdit = (med) => {
    setEditMode(true); setCurrentMedication(med);
    const existingTimes = med.doseSchedules ? med.doseSchedules.map(s => {
      const date = new Date(s.scheduledTime);
      return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }) : [];
    
    setFormData({
      name: med.name || '', dose: med.dose || '',
      frequencyPerDay: med.frequencyPerDay || '',
      durationDays: med.durationDays || '',
      startDate: med.startDate ? new Date(med.startDate).toISOString().split('T')[0] : '',
      notes: med.notes || '',
      doseTimes: existingTimes,
    });
    setError(''); setOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) { setError('İlaç adı zorunludur.'); return; }
    try {
      const start = new Date(formData.startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + (parseInt(formData.durationDays) || 30));
      const payload = {
        name: formData.name, dose: formData.dose,
        frequencyPerDay: parseInt(formData.frequencyPerDay) || 1,
        durationDays: parseInt(formData.durationDays) || 30,
        startDate: start.toISOString(), endDate: end.toISOString(),
        notes: formData.notes, patientId: parseInt(patientId),
        doseSchedules: formData.doseTimes.map(time => {
          const [hours, minutes] = time.split(':').map(Number);
          const scheduledTime = new Date(start);
          scheduledTime.setHours(hours, minutes, 0, 0);
          return { scheduledTime: scheduledTime.toISOString() };
        })
      };
      if (editMode) {
        await api.put(`/Medication/${currentMedication.id}`, payload);
        setMsg('İlaç güncellendi.');
      } else {
        await api.post('/Medication', payload);
        setMsg('İlaç eklendi.');
      }
      await fetchMedications();
      setOpenDialog(false);
    } catch { setError('İlaç kaydedilemedi.'); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/Medication/${deleteDialog.id}`);
      setMsg('İlaç silindi.');
      await fetchMedications();
    } catch { setError('İlaç silinemedi.'); }
    finally { setDeleteDialog({ open: false, id: null }); }
  };

  if (loading) return <LoadingSpinner text="İlaçlar yükleniyor..." />;

  return (
    <Card sx={{ borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, background: 'white' }}>
        <Box>
          <Typography variant="h6" fontWeight={700}>İlaçlar ({medications.length})</Typography>
          <Typography variant="caption" color="text.secondary">Satıra tıklayarak doz saatlerini görün</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}
          sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', boxShadow: '0 4px 12px rgba(79,70,229,0.3)' }}
        >
          İlaç Ekle
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ m: 2, borderRadius: '12px' }} onClose={() => setError('')}>{error}</Alert>}
      {msg && <Alert severity="success" sx={{ m: 2, borderRadius: '12px' }} onClose={() => setMsg('')}>{msg}</Alert>}

      {medications.length === 0 ? (
        <Box py={6}><EmptyState message="Henüz ilaç reçete edilmedi" icon={MedicationIcon} action={{ label: 'İlk İlacı Ekle', onClick: openAdd }} /></Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: '#F9FAFB' }}>
                <TableCell sx={{ fontWeight: 600, py: 2, width: 32 }} />
                <TableCell sx={{ fontWeight: 600, py: 2 }}>İlaç</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Doz</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Sıklık</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Süre / İlerleme</TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Durum</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medications.map(med => {
                const status = getMedStatus(med.startDate, med.endDate);
                const doseTimes = med.doseSchedules ? med.doseSchedules.map(s => {
                  const date = new Date(s.scheduledTime);
                  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                }) : generateDoseTimes(med.frequencyPerDay);
                const isExpanded = expandedRow === med.id;
                return (
                  <React.Fragment key={med.id}>
                    <TableRow
                      onClick={() => setExpandedRow(isExpanded ? null : med.id)}
                      sx={{ cursor: 'pointer', '&:hover': { background: alpha(theme.palette.primary.main, 0.03) }, transition: 'background 0.2s' }}
                    >
                      <TableCell sx={{ py: 1.5 }}>
                        {isExpanded ? <ExpandLessIcon sx={{ fontSize: 18, color: 'text.secondary' }} /> : <ExpandMoreIcon sx={{ fontSize: 18, color: 'text.secondary' }} />}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: alpha(theme.palette.primary.main, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <MedicationIcon sx={{ color: theme.palette.primary.main, fontSize: 18 }} />
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={700}>{med.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{new Date(med.startDate).toLocaleDateString('tr-TR')}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={med.dose} size="small" sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main, fontWeight: 600, borderRadius: '8px' }} />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="body2">{med.frequencyPerDay}x / gün</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ minWidth: 160 }}>
                        <Typography variant="body2" color="text.secondary" mb={0.5}>{med.durationDays} gün</Typography>
                        {status.progress !== undefined && (
                          <LinearProgress variant="determinate" value={status.progress} sx={{ height: 6, borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.1), '& .MuiLinearProgress-bar': { borderRadius: 3 } }} />
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={status.label} size="small"
                          color={status.color === 'default' ? undefined : status.color}
                          sx={{ fontWeight: 600, borderRadius: '8px', ...(status.color === 'default' ? { bgcolor: alpha(theme.palette.grey[500], 0.1), color: theme.palette.grey[600] } : {}) }}
                        />
                      </TableCell>
                      <TableCell align="right" onClick={e => e.stopPropagation()}>
                        <IconButton size="small" onClick={() => openEdit(med)}
                          sx={{ mr: 0.5, color: theme.palette.primary.main, bgcolor: alpha(theme.palette.primary.main, 0.1), '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) } }}
                        ><EditIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => setDeleteDialog({ open: true, id: med.id })}
                          sx={{ color: theme.palette.error.main, bgcolor: alpha(theme.palette.error.main, 0.1), '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) } }}
                        ><DeleteIcon fontSize="small" /></IconButton>
                      </TableCell>
                    </TableRow>

                    {/* Expanded: Dose Schedule */}
                    <TableRow>
                      <TableCell colSpan={7} sx={{ p: 0, border: 0 }}>
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <Box sx={{ px: 4, py: 3, background: alpha(theme.palette.primary.main, 0.02), borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.08)}` }}>
                            <Typography variant="subtitle2" fontWeight={700} gutterBottom color="primary.main">
                              📅 Günlük Doz Saatleri
                            </Typography>
                            <Box display="flex" gap={1.5} flexWrap="wrap" mb={2}>
                              {med.doseSchedules?.map((s, i) => {
                                const date = new Date(s.scheduledTime);
                                const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                                const isTaken = s.records && s.records.length > 0 && s.records.some(r => r.isTaken);
                                
                                return (
                                  <Box key={i} sx={{
                                    px: 2.5, py: 1.5, borderRadius: '14px',
                                    bgcolor: 'white', border: `1px solid ${isTaken ? alpha(theme.palette.success.main, 0.3) : alpha(theme.palette.primary.main, 0.2)}`,
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80,
                                    position: 'relative',
                                    boxShadow: isTaken ? `0 0 10px ${alpha(theme.palette.success.main, 0.1)}` : 'none'
                                  }}>
                                    {isTaken ? (
                                      <Chip label="Alındı" size="extrasmall" color="success" sx={{ position: 'absolute', top: -10, height: 16, fontSize: '9px', fontWeight: 800 }} />
                                    ) : (
                                      <Chip label="Bekliyor" size="extrasmall" sx={{ position: 'absolute', top: -10, height: 16, fontSize: '9px', fontWeight: 800, bgcolor: 'grey.100' }} />
                                    )}
                                    <AccessTimeIcon sx={{ fontSize: 18, color: isTaken ? theme.palette.success.main : theme.palette.primary.main, mb: 0.3 }} />
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: isTaken ? 'success.main' : 'text.primary' }}>{time}</Typography>
                                    <Typography variant="caption" color="text.secondary">{i + 1}. doz</Typography>
                                  </Box>
                                );
                              })}
                            </Box>
                            {med.notes && (
                              <Box sx={{ p: 2, borderRadius: '12px', bgcolor: alpha(theme.palette.warning.main, 0.06), border: `1px solid ${alpha(theme.palette.warning.main, 0.15)}` }}>
                                <Typography variant="caption" color="text.secondary" display="block" fontWeight={600} mb={0.3}>📝 Notlar</Typography>
                                <Typography variant="body2">{med.notes}</Typography>
                              </Box>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '24px', padding: 1 } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h5" fontWeight={700}>{editMode ? 'İlacı Düzenle' : 'İlaç Ekle'}</Typography>
          <IconButton onClick={() => setOpenDialog(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>{error}</Alert>}
          <Box display="flex" flexDirection="column" gap={2.5} sx={{ mt: 1 }}>
            <TextField label="İlaç Adı" name="name" value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              fullWidth required InputProps={{ sx: { borderRadius: '12px' } }} />
            <TextField label="Doz (örn: 500mg)" name="dose" value={formData.dose}
              onChange={e => setFormData({ ...formData, dose: e.target.value })}
              fullWidth required InputProps={{ sx: { borderRadius: '12px' } }} />
            <Box display="flex" gap={2}>
              <TextField label="Günlük Sıklık" name="frequencyPerDay" type="number" value={formData.frequencyPerDay}
                onChange={e => setFormData({ ...formData, frequencyPerDay: e.target.value })}
                fullWidth required InputProps={{ sx: { borderRadius: '12px' } }}
                helperText="Örn: 3 (günde 3x)" />
              <TextField label="Süre (Gün)" name="durationDays" type="number" value={formData.durationDays}
                onChange={e => setFormData({ ...formData, durationDays: e.target.value })}
                fullWidth required InputProps={{ sx: { borderRadius: '12px' } }} />
            </Box>

            {/* Custom Dose Times UI */}
            {formData.doseTimes.length > 0 && (
              <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: '16px', border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}` }}>
                <Typography variant="caption" fontWeight={700} color="primary" gutterBottom display="block">
                  Doz Saatlerini Ayarlayın
                </Typography>
                <Box display="flex" gap={1.5} flexWrap="wrap">
                  {formData.doseTimes.map((time, index) => (
                    <TextField
                      key={index}
                      label={`${index + 1}. Doz`}
                      type="time"
                      size="small"
                      value={time}
                      onChange={e => {
                        const newTimes = [...formData.doseTimes];
                        newTimes[index] = e.target.value;
                        setFormData({ ...formData, doseTimes: newTimes });
                      }}
                      sx={{ width: 100 }}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: { borderRadius: '10px', fontSize: '13px' } }}
                    />
                  ))}
                </Box>
              </Box>
            )}
            <TextField label="Başlangıç Tarihi" name="startDate" type="date" value={formData.startDate}
              onChange={e => setFormData({ ...formData, startDate: e.target.value })}
              fullWidth required InputLabelProps={{ shrink: true }} InputProps={{ sx: { borderRadius: '12px' } }} />
            <TextField label="Notlar" name="notes" value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              fullWidth multiline rows={2} InputProps={{ sx: { borderRadius: '12px' } }} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ borderRadius: '10px', color: 'text.secondary' }}>İptal</Button>
          <Button onClick={handleSubmit} variant="contained"
            sx={{ borderRadius: '10px', px: 4, background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}
          >{editMode ? 'Değişiklikleri Kaydet' : 'İlaç Ekle'}</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })} PaperProps={{ sx: { borderRadius: '20px', p: 1 } }} maxWidth="xs" fullWidth>
        <DialogTitle><Typography variant="h6" fontWeight={700}>İlacı Sil</Typography></DialogTitle>
        <DialogContent><Typography color="text.secondary">Bu ilacı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</Typography></DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })} sx={{ borderRadius: '10px', color: 'text.secondary' }}>Vazgeç</Button>
          <Button onClick={handleDelete} variant="contained" color="error" sx={{ borderRadius: '10px', px: 3 }}>Evet, Sil</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default Medications;
