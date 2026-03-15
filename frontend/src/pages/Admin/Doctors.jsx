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
  TextField,
  Box,
  CircularProgress,
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

const AdminDoctors = () => {
  const theme = useTheme();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    department: '',
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/Doctor');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError('Doktorlar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (doctor = null) => {
    if (doctor) {
      setEditMode(true);
      setCurrentDoctor(doctor);
      setFormData({
        fullName: doctor.user?.fullName || '',
        username: doctor.user?.username || '',
        password: '',
        department: doctor.department || '',
      });
    } else {
      setEditMode(false);
      setCurrentDoctor(null);
      setFormData({
        fullName: '',
        username: '',
        password: '',
        department: '',
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
      department: '',
    });
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
      if (editMode) {
        await api.put(`/Doctor/${currentDoctor.id}`, {
          id: currentDoctor.id,
          userId: currentDoctor.userId,
          department: formData.department,
        });
        setMsg('Doctor updated successfully');
      } else {
        await api.post('/Auth/register', {
          fullName: formData.fullName,
          username: formData.username,
          password: formData.password,
          role: 'Doctor',
          department: formData.department,
        });
        setMsg('Doctor created successfully');
      }
      fetchDoctors();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving doctor:', error);
      setError(error.response?.data?.message || 'Doktor kaydedilemedi');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await api.delete(`/Doctor/${id}`);
        fetchDoctors();
      } catch (error) {
        console.error('Error deleting doctor:', error);
        setError('Doktor silinemedi');
      }
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner text="Loading doctors..." />;
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          color: 'white',
          py: 6,
          px: 3,
          mb: 4,
          borderRadius: '0 0 32px 32px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 40px -10px rgba(79, 70, 229, 0.5)',
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
                Doktor Yönetimi
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.95 }}>
                Doktorları ve tıbbi personeli yönetin
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
              Yeni Doktor Ekle
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
              Tüm Doktorlar ({filteredDoctors.length})
            </Typography>
            <TextField
              placeholder="Doktor ara veya bölüm..."
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
                  '&.Mui-focused fieldset': { border: '1px solid #4F46E5' },
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
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Doktor</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Bölüm</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Kullanıcı Adı</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Kayıt Tarihi</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor) => (
                    <TableRow
                      key={doctor.id}
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
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              width: 40,
                              height: 40,
                            }}
                          >
                            {doctor.user?.fullName?.charAt(0) || <PersonIcon />}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {doctor.user?.fullName || 'N/A'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: #{doctor.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {doctor.department ? (
                          <Chip
                            label={doctor.department}
                            size="small"
                            sx={{
                              bgcolor: alpha(theme.palette.info.main, 0.1),
                              color: theme.palette.info.main,
                              fontWeight: 500,
                              borderRadius: '8px',
                            }}
                          />
                        ) : (
                          <Chip label="Unassigned" size="small" variant="outlined" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          @{doctor.user?.username || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(doctor.createdAt).toLocaleDateString()}
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
                          onClick={() => handleOpenDialog(doctor)}
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
                          onClick={() => handleDelete(doctor.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <EmptyState
                        message={searchTerm ? "Aramanızla eşleşen doktor bulunamadı" : "Henüz doktor eklenmedi"}
                        icon={PersonIcon}
                        action={!searchTerm ? { label: "İlk Doktoru Ekle", onClick: () => handleOpenDialog() } : null}
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
            {editMode ? 'Doktoru Düzenle' : 'Yeni Doktor'}
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
              label="Bölüm"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              fullWidth
              InputProps={{
                sx: { borderRadius: '12px' },
              }}
              helperText="e.g. Cardiology, Neurology, Pediatrics"
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
            {editMode ? 'Değişiklikleri Kaydet' : 'Doktor Ekle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDoctors;