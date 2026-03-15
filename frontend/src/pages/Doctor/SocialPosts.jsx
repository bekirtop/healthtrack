import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Card, Button, CardMedia, CardContent, TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../../auth/AuthContext';
import api from '../../api/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner';

const DoctorSocialPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ imageUrl: '', caption: '' });
  const [doctorId, setDoctorId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user?.userId) fetchDoctorAndPosts();
  }, [user]);

  const fetchDoctorAndPosts = async () => {
    try {
      const docsRes = await api.get('/Doctor');
      const doctor = docsRes.data.find(d => d.userId == user.userId);
      
      if (doctor) {
        setDoctorId(doctor.id);
        const postsRes = await api.get(`/SocialPost/doctor/${doctor.id}`);
        setPosts(postsRes.data || []);
      } else {
        setErrorMsg('Giriş yapan kullanıcıya ait doktor profili bulunamadı.');
      }
    } catch (error) {
      console.error('Error fetching social posts:', error);
      setErrorMsg('Doktor bilgileri alınırken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.imageUrl || !newPost.caption || !doctorId) return;
    try {
      const response = await api.post('/SocialPost', {
        doctorId,
        imageUrl: newPost.imageUrl,
        caption: newPost.caption
      });
      setPosts([response.data, ...posts]);
      setNewPost({ imageUrl: '', caption: '' });
    } catch (error) {
      console.error('Failed to create post', error);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await api.delete(`/SocialPost/${id}`);
      setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete post', error);
    }
  };

  if (loading) return <LoadingSpinner text="Sosyal Akış Yükleniyor..." />;

  return (
    <Box>
      <Box sx={{ background: 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)', color: 'white', py: 6, px: 3, mb: 4, borderRadius: '0 0 32px 32px' }}>
        <Container maxWidth={false}>
          <Typography variant="h3" fontWeight={700}>Sosyal Akış</Typography>
          <Typography variant="h6">Hastalarınızla duyuru ve görsel paylaşın (Instagram stili)</Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ mb: 4 }}>
        {errorMsg && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }} onClose={() => setErrorMsg('')}>{errorMsg}</Alert>}
        <Card sx={{ p: 3, mb: 4, borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>Yeni Gönderi Oluştur</Typography>
          <TextField 
            fullWidth label="Görsel URL (Örn: https://example.com/image.jpg)" 
            variant="outlined" size="small" sx={{ mb: 2 }}
            value={newPost.imageUrl}
            onChange={(e) => setNewPost({ ...newPost, imageUrl: e.target.value })}
          />
          <TextField 
            fullWidth label="Açıklama" variant="outlined" size="small" multiline rows={3} sx={{ mb: 2 }}
            value={newPost.caption}
            onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
          />
          <Button 
            variant="contained" onClick={handleCreatePost}
            sx={{ borderRadius: '10px', background: 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)' }}
          >
            Gönderiyi Paylaş
          </Button>
        </Card>

        {posts.map(post => (
          <Card key={post.id} sx={{ mb: 4, borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardMedia component="img" image={post.imageUrl} alt="Gönderi Görseli" sx={{ maxHeight: 500, objectFit: 'cover' }} />
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="body1" sx={{ mt: 1 }}>{post.caption}</Typography>
                <Typography variant="caption" color="text.secondary">{new Date(post.createdAt).toLocaleString('tr-TR')}</Typography>
              </Box>
              <IconButton color="error" onClick={() => handleDeletePost(post.id)}>
                <DeleteIcon />
              </IconButton>
            </CardContent>
          </Card>
        ))}
        {posts.length === 0 && <Typography align="center" color="text.secondary">Henüz bir gönderi paylaşılmamış.</Typography>}
      </Container>
    </Box>
  );
};

export default DoctorSocialPosts;
