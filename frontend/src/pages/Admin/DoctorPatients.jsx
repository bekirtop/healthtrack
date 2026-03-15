import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Alert,
  Avatar,
  Chip,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  alpha,
  Divider,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import LinkIcon from '@mui/icons-material/Link';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import api from '../../api/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const AdminDoctorPatients = () => {
  const theme = useTheme();

  // Data
  const [assignments, setAssignments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  // UI State
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [filterDoctorId, setFilterDoctorId] = useState('');

  // Form
  const [formData, setFormData] = useState({ doctorId: '', patientId: '' });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [docRes, patRes] = await Promise.all([
        api.get('/Doctor'),
        api.get('/Patient'),
      ]);
      
      const doctorsList = docRes.data;
      const patientsList = patRes.data;

      setDoctors(doctorsList);
      setPatients(patientsList);

      // Create assignments list from patients who have a doctor assigned
      const derivedAssignments = patientsList
        .filter(p => p.doctorId != null)
        .map(p => {
          const doctor = doctorsList.find(d => d.id === p.doctorId);
          return {
            doctorId: p.doctorId,
            patientId: p.id,
            doctorName: doctor?.user?.fullName || `Doktor #${p.doctorId}`,
            doctorDepartment: doctor?.department,
            patientName: p.fullName || p.user?.fullName || `Hasta #${p.id}`,
            patientDiagnosis: p.diagnosis,
            assignedAt: p.createdAt // Using patient's creation or assignment date
          };
        });

      setAssignments(derivedAssignments);
    } catch (err) {
      console.error(err);
      setError('Veriler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setFormData({ doctorId: '', patientId: '' });
    setError('');
    setMsg('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError('');
    setMsg('');
  };

  const handleAssign = async () => {
    if (!formData.doctorId || !formData.patientId) {
      setError('Lütfen doktor ve hasta seçin.');
      return;
    }
    try {
      await api.post(`/Patient/${formData.patientId}/assign-doctor/${formData.doctorId}`);
      setMsg('Hasta başarıyla doktora atandı.');
      await fetchAll();
      handleCloseDialog();
    } catch (err) {
      const serverMsg = err.response?.data?.message;
      setError(serverMsg || 'Atama başarısız oldu.');
    }
  };

  const handleUnassign = async (doctorId, patientId) => {
    if (!window.confirm('Bu atamayı kaldırmak istediğinize emin misiniz?')) return;
    try {
      await api.post(`/Patient/${patientId}/unassign-doctor`);
      setMsg('Atama kaldırıldı.');
      await fetchAll();
    } catch (err) {
      setError('Atama kaldırılamadı.');
    }
  };

  const filteredAssignments = filterDoctorId
    ? assignments.filter((a) => a.doctorId === Number(filterDoctorId))
    : assignments;

  // Find patients not yet assigned to any doctor
  const availablePatients = patients.filter(
    (p) => p.doctorId === null
  );

  if (loading) return <LoadingSpinner text="Atamalar yükleniyor..." />;

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)',
          color: 'white',
          py: 6,
          px: 3,
          mb: 4,
          borderRadius: '0 0 32px 32px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 40px -10px rgba(14, 165, 233, 0.5)',
        }}
      >
        <Box
          sx={{
            position: 'absolute', top: -50, right: -50,
            width: 200, height: 200, borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute', bottom: -30, left: -30,
            width: 150, height: 150, borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
          }}
        />
        <Container maxWidth={false} sx={{ position: 'relative', zIndex: 1, px: { xs: 2, md: 4 } }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h3" fontWeight={700} gutterBottom>
                Doktor–Hasta Atamaları
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.95 }}>
                Doktor ve hasta arasındaki ilişkileri yönetin
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                px: 3, py: 1.5,
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.3)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.2)',
                },
              }}
            >
              Yeni Atama
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Stats Row */}
      <Container maxWidth={false} sx={{ mb: 3, px: { xs: 2, md: 4 } }}>
        <Box display="flex" gap={2} flexWrap="wrap">
          {[
            { label: 'Toplam Atama', value: assignments.length, color: '#6366F1', icon: <LinkIcon /> },
            { label: 'Atanmış Doktor', value: [...new Set(assignments.map(a => a.doctorId))].length, color: '#0EA5E9', icon: <LocalHospitalIcon /> },
            { label: 'Atanmış Hasta', value: [...new Set(assignments.map(a => a.patientId))].length, color: '#10B981', icon: <PersonIcon /> },
          ].map((stat) => (
            <Box
              key={stat.label}
              sx={{
                flex: 1, minWidth: 150,
                p: 2.5,
                borderRadius: '16px',
                background: alpha(stat.color, 0.08),
                border: `1px solid ${alpha(stat.color, 0.2)}`,
                display: 'flex', alignItems: 'center', gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 44, height: 44, borderRadius: '12px',
                  background: alpha(stat.color, 0.15),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: stat.color,
                }}
              >
                {stat.icon}
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700} color={stat.color}>{stat.value}</Typography>
                <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Main Table */}
      <Container maxWidth={false} sx={{ mb: 4, px: { xs: 2, md: 4 } }}>
        {error && (
          <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2, borderRadius: '12px' }}>
            {error}
          </Alert>
        )}
        {msg && (
          <Alert severity="success" onClose={() => setMsg('')} sx={{ mb: 2, borderRadius: '12px' }}>
            {msg}
          </Alert>
        )}

        <Card
          sx={{
            borderRadius: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.05)',
            overflow: 'hidden',
          }}
        >
          {/* Toolbar */}
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
              Tüm Atamalar ({filteredAssignments.length})
            </Typography>
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel>Doktora göre filtrele</InputLabel>
              <Select
                value={filterDoctorId}
                label="Doktora göre filtrele"
                onChange={(e) => setFilterDoctorId(e.target.value)}
                sx={{ borderRadius: '12px' }}
              >
                <MenuItem value="">Tümü</MenuItem>
                {doctors.map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.user?.fullName || `Doktor #${d.id}`}
                    {d.department ? ` – ${d.department}` : ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#F9FAFB' }}>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Doktor</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Bölüm</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Hasta</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Tanı</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Atanma Tarihi</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAssignments.length > 0 ? (
                  filteredAssignments.map((a, idx) => (
                    <TableRow
                      key={`${a.doctorId}-${a.patientId}`}
                      sx={{
                        '&:hover': { background: alpha(theme.palette.primary.main, 0.02) },
                        transition: 'background 0.2s',
                      }}
                    >
                      {/* Doctor */}
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Avatar
                            sx={{
                              bgcolor: alpha('#6366F1', 0.1),
                              color: '#6366F1',
                              width: 36, height: 36, fontSize: '0.9rem',
                            }}
                          >
                            {a.doctorName?.charAt(0) || 'D'}
                          </Avatar>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {a.doctorName}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Department */}
                      <TableCell>
                        {a.doctorDepartment ? (
                          <Chip
                            label={a.doctorDepartment}
                            size="small"
                            sx={{
                              bgcolor: alpha('#0EA5E9', 0.1),
                              color: '#0EA5E9',
                              fontWeight: 500,
                              borderRadius: '8px',
                            }}
                          />
                        ) : (
                          <Chip label="Belirtilmemiş" size="small" variant="outlined" />
                        )}
                      </TableCell>

                      {/* Patient */}
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Avatar
                            sx={{
                              bgcolor: alpha('#10B981', 0.1),
                              color: '#10B981',
                              width: 36, height: 36, fontSize: '0.9rem',
                            }}
                          >
                            {a.patientName?.charAt(0) || 'H'}
                          </Avatar>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {a.patientName}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Diagnosis */}
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {a.patientDiagnosis || '—'}
                        </Typography>
                      </TableCell>

                      {/* AssignedAt */}
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                          <Typography variant="body2" color="text.secondary">
                            {new Date(a.assignedAt).toLocaleDateString('tr-TR', {
                              year: 'numeric', month: 'short', day: 'numeric',
                            })}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="right">
                        <Tooltip title="Atamayı kaldır">
                          <IconButton
                            size="small"
                            sx={{
                              color: theme.palette.error.main,
                              bgcolor: alpha(theme.palette.error.main, 0.1),
                              '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) },
                            }}
                            onClick={() => handleUnassign(a.doctorId, a.patientId)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <EmptyState
                        message={filterDoctorId ? 'Bu doktora atanmış hasta yok' : 'Henüz hiç atama yapılmamış'}
                        icon={LinkIcon}
                        action={!filterDoctorId ? { label: 'İlk Atamayı Yap', onClick: handleOpenDialog } : null}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Container>

      {/* Assign Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '24px', padding: 1 },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box>
            <Typography variant="h5" fontWeight={700}>Yeni Atama</Typography>
            <Typography variant="body2" color="text.secondary">
              Bir doktor ile hasta arasında ilişki kurun
            </Typography>
          </Box>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>{error}</Alert>
          )}

          <Box display="flex" flexDirection="column" gap={3} sx={{ mt: 1 }}>
            {/* Doctor Select */}
            <FormControl fullWidth required>
              <InputLabel>Doktor Seç</InputLabel>
              <Select
                value={formData.doctorId}
                label="Doktor Seç"
                onChange={(e) => setFormData({ ...formData, doctorId: e.target.value, patientId: '' })}
                sx={{ borderRadius: '12px' }}
              >
                {doctors.map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: alpha('#6366F1', 0.1), color: '#6366F1', fontSize: '0.8rem' }}>
                        {d.user?.fullName?.charAt(0) || 'D'}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{d.user?.fullName}</Typography>
                        {d.department && (
                          <Typography variant="caption" color="text.secondary">{d.department}</Typography>
                        )}
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider>
              <Chip
                icon={<LinkIcon />}
                label="ile"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Divider>

            {/* Patient Select */}
            <FormControl fullWidth required disabled={!formData.doctorId}>
              <InputLabel>Hasta Seç</InputLabel>
              <Select
                value={formData.patientId}
                label="Hasta Seç"
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                sx={{ borderRadius: '12px' }}
              >
                {availablePatients.length === 0 && formData.doctorId ? (
                  <MenuItem disabled>Bu doktora atanabilecek hasta yok</MenuItem>
                ) : (
                  availablePatients.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: alpha('#10B981', 0.1), color: '#10B981', fontSize: '0.8rem' }}>
                          {p.fullName?.charAt(0) || 'H'}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{p.fullName}</Typography>
                          {p.diagnosis && (
                            <Typography variant="caption" color="text.secondary">{p.diagnosis}</Typography>
                          )}
                        </Box>
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{ borderRadius: '10px', px: 3, color: 'text.secondary' }}
          >
            İptal
          </Button>
          <Button
            onClick={handleAssign}
            variant="contained"
            startIcon={<LinkIcon />}
            sx={{
              borderRadius: '10px',
              px: 4,
              py: 1,
              background: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)',
            }}
          >
            Ata
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDoctorPatients;
