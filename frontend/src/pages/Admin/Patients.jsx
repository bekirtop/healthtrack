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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Alert,
  InputAdornment,
  Avatar,
  Chip,
  Card,
  useTheme,
  alpha
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import api from '../../api/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const AdminPatients = () => {
  const theme = useTheme();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    diagnosis: '',
    dischargeDate: '',
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await api.get('/Patient');
      setPatients(response.data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setError('Hastalar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (patient = null) => {
    if (patient) {
      setEditMode(true);
      setCurrentPatient(patient);
      setFormData({
        fullName: patient.user?.fullName || '',
        username: patient.user?.username || '',
        password: '',
        diagnosis: patient.diagnosis || '',
        dischargeDate: patient.dischargeDate
          ? new Date(patient.dischargeDate).toISOString().split('T')[0]
          : '',
      });
    } else {
      setEditMode(false);
      setCurrentPatient(null);
      setFormData({
        fullName: '',
        username: '',
        password: '',
        diagnosis: '',
        dischargeDate: '',
      });
    }
    setOpenDialog(true);
    setError('');
    setMsg('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      fullName: '',
      username: '',
      password: '',
      diagnosis: '',
      dischargeDate: '',
    });
    setError('');
    setMsg('');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await api.put(`/Patient/${currentPatient.id}`, {
          id: currentPatient.id,
          userId: currentPatient.userId,
          diagnosis: formData.diagnosis,
          dischargeDate: formData.dischargeDate || null,
        });
        setMsg('Patient updated successfully');
      } else {
        await api.post('/Auth/register', {
          fullName: formData.fullName,
          username: formData.username,
          password: formData.password,
          role: 'Patient',
          diagnosis: formData.diagnosis,
        });
        setMsg('Patient created successfully');
      }
      fetchPatients();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving patient:', error);
      setError(error.response?.data || 'Hasta kaydedilemedi');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    try {
      await api.delete(`/Patient/${id}`);
      fetchPatients();
    } catch (error) {
      console.error('Error deleting patient:', error);
      setError('Hasta silinemedi');
    }
  };

  const filteredPatients = patients.filter(p =>
    p.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner text="Loading patients..." />;
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
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h3" fontWeight={700} gutterBottom>
                Hasta Yönetimi
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.95 }}>
                Hasta kayıtlarını ve tıbbi bilgileri yönetin
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                px: 3,
                py: 1.5,
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
              Yeni Hasta Ekle
            </Button>
          </Box>
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

          {error && (
            <Alert severity="error" onClose={() => setError('')} sx={{ m: 2 }}>
              {error}
            </Alert>
          )}

          {msg && (
            <Alert severity="success" onClose={() => setMsg('')} sx={{ m: 2 }}>
              {msg}
            </Alert>
          )}

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: '#F9FAFB' }}>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Hasta</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Tanı</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Kullanıcı Adı</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Taburcu Tarihi</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Kayıt Tarihi</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((p) => (
                    <TableRow
                      key={p.id}
                      sx={{
                        '&:hover': {
                          background: alpha(theme.palette.secondary.main, 0.02),
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
                            {p.user?.fullName?.charAt(0) || <PersonIcon />}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {p.user?.fullName || 'N/A'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: #{p.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {p.diagnosis ? (
                          <Chip
                            label={p.diagnosis}
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
                          <Chip label="Tanı yok" size="small" variant="outlined" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          @{p.user?.username || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {p.dischargeDate
                            ? new Date(p.dischargeDate).toLocaleDateString()
                            : 'Aktif'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {p.createdAt
                            ? new Date(p.createdAt).toLocaleDateString()
                            : 'N/A'}
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
                          onClick={() => handleOpenDialog(p)}
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
                          onClick={() => handleDelete(p.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <EmptyState
                        message={searchTerm ? "Aramanızla eşleşen hasta bulunamadı" : "Henüz hasta kaydı yok"}
                        icon={PersonIcon}
                        action={!searchTerm ? { label: "İlk Hastayı Ekle", onClick: () => handleOpenDialog() } : null}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Container>

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
            {editMode ? 'Hastayı Düzenle' : 'Yeni Hasta'}
          </Typography>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box component="form" display="flex" flexDirection="column" gap={3} sx={{ mt: 1 }}>
            {!editMode && (
              <>
                <TextField
                  label="Ad Soyad"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputProps={{
                    sx: { borderRadius: '12px' },
                  }}
                />
                <TextField
                  label="Kullanıcı Adı"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputProps={{
                    sx: { borderRadius: '12px' },
                  }}
                />
                <TextField
                  label="Şifre"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputProps={{
                    sx: { borderRadius: '12px' },
                  }}
                />
              </>
            )}
            <TextField
              label="Tanı"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              InputProps={{
                sx: { borderRadius: '12px' },
              }}
              helperText="Hastanın tıbbi tanısını girin"
            />
            <TextField
              label="Taburcu Tarihi"
              name="dischargeDate"
              type="date"
              value={formData.dischargeDate}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{
                sx: { borderRadius: '12px' },
              }}
              helperText="Hasta hala aktifse boş bırakın"
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
              background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
            }}
          >
            {editMode ? 'Değişiklikleri Kaydet' : 'Hasta Ekle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPatients;
