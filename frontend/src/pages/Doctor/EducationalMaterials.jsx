import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, Button, TextField, IconButton, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../../auth/AuthContext';
import api from '../../api/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner';

const DoctorEducationalMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMaterial, setNewMaterial] = useState({ title: '', content: '', fileUrl: '', videoUrl: '' });
  const [doctorId, setDoctorId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user?.userId) fetchDoctorAndMaterials();
  }, [user]);

  const fetchDoctorAndMaterials = async () => {
    try {
      const docsRes = await api.get('/Doctor');
      const doctor = docsRes.data.find(d => d.userId == user.userId);
      
      if (doctor) {
        setDoctorId(doctor.id);
        const res = await api.get(`/EducationalMaterial/doctor/${doctor.id}`);
        setMaterials(res.data || []);
      } else {
        setErrorMsg('Doktor profili bulunamadı.');
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
      setErrorMsg('Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMaterial = async () => {
    if (!newMaterial.title || !newMaterial.content || !doctorId) return;
    try {
      const response = await api.post('/EducationalMaterial', {
        doctorId,
        ...newMaterial
      });
      setMaterials([response.data, ...materials]);
      setNewMaterial({ title: '', content: '', fileUrl: '', videoUrl: '' });
    } catch (error) {
      console.error('Failed to create material', error);
    }
  };

  const handleDeleteMaterial = async (id) => {
    try {
      await api.delete(`/EducationalMaterial/${id}`);
      setMaterials(materials.filter(m => m.id !== id));
    } catch (error) {
      console.error('Failed to delete material', error);
    }
  };

  if (loading) return <LoadingSpinner text="Materyaller Yükleniyor..." />;

  return (
    <Box>
      <Box sx={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', color: 'white', py: 6, px: 3, mb: 4, borderRadius: '0 0 32px 32px' }}>
        <Container maxWidth={false}>
          <Typography variant="h3" fontWeight={700}>Eğitim Materyalleri</Typography>
          <Typography variant="h6">Hastalarınız için eğitim makaleleri ve videolar sağlayın</Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ mb: 4 }}>
        {errorMsg && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }} onClose={() => setErrorMsg('')}>{errorMsg}</Alert>}
        <Card sx={{ p: 3, mb: 4, borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>Yeni Eğitim İçeriği Oluştur</Typography>
          <TextField 
            fullWidth label="Başlık" variant="outlined" size="small" sx={{ mb: 2 }}
            value={newMaterial.title}
            onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
          />
          <TextField 
            fullWidth label="İçerik (Metin)" variant="outlined" size="small" multiline rows={4} sx={{ mb: 2 }}
            value={newMaterial.content}
            onChange={(e) => setNewMaterial({ ...newMaterial, content: e.target.value })}
          />
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <TextField 
              fullWidth label="Dosya URL (İsteğe Bağlı)" variant="outlined" size="small"
              value={newMaterial.fileUrl}
              onChange={(e) => setNewMaterial({ ...newMaterial, fileUrl: e.target.value })}
            />
            <TextField 
              fullWidth label="Video URL (İsteğe Bağlı)" variant="outlined" size="small"
              value={newMaterial.videoUrl}
              onChange={(e) => setNewMaterial({ ...newMaterial, videoUrl: e.target.value })}
            />
          </Stack>
          <Button 
            variant="contained" onClick={handleCreateMaterial}
            sx={{ borderRadius: '10px', background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)' }}
          >
            İçeriği Paylaş
          </Button>
        </Card>

        {materials.map(material => (
          <Card key={material.id} sx={{ mb: 3, p: 3, borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>{material.title}</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>{material.content}</Typography>
                
                {material.videoUrl && (
                  <Typography variant="body2" color="primary" sx={{ display: 'block', mb: 1 }}>
                    <a href={material.videoUrl} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600 }}>▶ Videoyu İzle</a>
                  </Typography>
                )}
                {material.fileUrl && (
                  <Typography variant="body2" color="secondary" sx={{ display: 'block' }}>
                    <a href={material.fileUrl} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600 }}>⬇ Dosyayı Görüntüle</a>
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                  {new Date(material.createdAt).toLocaleString('tr-TR')}
                </Typography>
              </Box>
              <IconButton color="error" onClick={() => handleDeleteMaterial(material.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Card>
        ))}
        {materials.length === 0 && <Typography align="center" color="text.secondary">Henüz bir eğitim materyali paylaşılmamış.</Typography>}
      </Container>
    </Box>
  );
};

export default DoctorEducationalMaterials;
