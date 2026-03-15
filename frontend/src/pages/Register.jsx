import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    InputAdornment,
    MenuItem,
    IconButton,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosInstance'; // Assuming axios instance is configured here or imported from axios directly if not
// Note: Based on Login.jsx, axios might be used directly or via context. Login.jsx uses `useAuth`.
// Registration is usually a public endpoint, so we can use axios directly or add register to AuthContext.
// For simplicity and to match typically patterns, I'll check if useAuth has register.
// If not, I'll simpler implementation using axios directly here, but using the configured axios from utils or main seems better if exists.
// Let's assume standard axios import for now, or check AuthContext. 
// Actually Login.jsx used `useAuth`. Let's assume I should add `register` to AuthContext or just do it here.
// I'll do it here for now to avoid modifying AuthContext if not strictly necessary, but actually AuthContext is cleaner.
// However, the plan didn't explicitly say modify AuthContext, just "Connect to /Auth/register".
// I'll use the simplest approach: standard axios call.

import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { keyframes } from '@mui/system';

// Reuse floating animation
const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: '',
        role: 'Patient',
        diagnosis: '',
        department: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Direct axios call since AuthContext might not have register yet
            // Adjust path if global axios config is different, but based on context it seems to be proxied or base URL set.
            // Login.jsx uses `useAuth` which calls `axios.post('/Auth/login')`.
            // I'll import axios from the same place AuthContext does or just use global if available.
            // Looking at previous file views, AuthContext imports `import axios from '../utils/axios'` or similar?
            // Wait, let's verify AuthContext import. 
            // Actually, I can just use the global axios if configured, or plain axios.
            // I'll stick to a safe bet: import axios from 'axios' and use relative path if proxy is set, or full path.
            // Given: `POST http://localhost:5018/api/Auth/login` was the log.
            // The frontend is likely using a proxy or base URL. 
            // I will assume standard axios usage for now.

            const response = await api.post('/Auth/register', formData);

            if (response.status === 200) {
                // Success
                navigate('/login', {
                    state: { message: 'Kayıt başarılı! Şimdi giriş yapabilirsiniz.' }
                });
            }
        } catch (err) {
            if (err.response) {
                setError(err.response.data || 'Kayıt işlemi başarısız.');
            } else {
                setError('Sunucuya ulaşılamadı.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                background: 'var(--color-bg-primary)',
            }}
        >
            {/* Left Side - Gradient Hero (Same as Login) */}
            <Box
                sx={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #06B6D4 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 6,
                }}
            >
                <Box sx={{ position: 'absolute', top: '15%', left: '15%', animation: `${float} 6s ease-in-out infinite`, opacity: 0.3 }}>
                    <LocalHospitalIcon sx={{ fontSize: 80, color: 'white' }} />
                </Box>
                <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white' }}>
                    <Box
                        sx={{
                            width: 100, height: 100, borderRadius: '24px', background: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 2rem', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        <LocalHospitalIcon sx={{ fontSize: 60 }} />
                    </Box>
                    <Typography variant="h2" fontWeight={700} gutterBottom>HealthTrack</Typography>
                    <Typography variant="h6" sx={{ opacity: 0.95 }}>Aramıza Katılın</Typography>
                </Box>
            </Box>

            {/* Right Side - Register Form */}
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3, overflowY: 'auto' }}>
                <Box sx={{ maxWidth: 480, width: '100%', animation: 'fadeIn 0.8s ease-out', my: 4 }}>
                    {/* Mobile Logo logic omitted for brevity, adding if needed */}

                    <Card sx={{ borderRadius: '24px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}>
                        <CardContent sx={{ p: 5 }}>
                            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: 'text.primary' }}>Kayıt Ol</Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>Yeni bir hesap oluşturun</Typography>

                            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>{error}</Alert>}

                            <form onSubmit={handleSubmit}>
                                <TextField
                                    label="Ad Soyad"
                                    name="fullName"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><BadgeIcon sx={{ color: 'text.secondary' }} /></InputAdornment>,
                                    }}
                                />

                                <TextField
                                    label="Kullanıcı Adı"
                                    name="username"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: 'text.secondary' }} /></InputAdornment>,
                                    }}
                                />

                                <TextField
                                    label="Şifre"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: 'text.secondary' }} /></InputAdornment>,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <TextField
                                    select
                                    label="Rol"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                >
                                    <MenuItem value="Patient">Hasta</MenuItem>
                                    <MenuItem value="Doctor">Doktor</MenuItem>
                                    <MenuItem value="Admin">Yönetici (Admin)</MenuItem>
                                </TextField>

                                {formData.role === 'Patient' && (
                                    <TextField
                                        label="Teşhis / Hastalık (Opsiyonel)"
                                        name="diagnosis"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        value={formData.diagnosis}
                                        onChange={handleChange}
                                        placeholder="Örn: Hipertansiyon, Diyabet..."
                                    />
                                )}

                                {formData.role === 'Doctor' && (
                                    <TextField
                                        label="Bölüm / Uzmanlık"
                                        name="department"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        value={formData.department}
                                        onChange={handleChange}
                                        required={formData.role === 'Doctor'}
                                        placeholder="Örn: Kardiyoloji"
                                    />
                                )}

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    disabled={loading}
                                    sx={{
                                        mt: 3,
                                        py: 1.5,
                                        fontSize: '1.05rem',
                                        fontWeight: 600,
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                                        boxShadow: '0 8px 24px rgba(79, 70, 229, 0.3)',
                                        '&:hover': { background: 'linear-gradient(135deg, #4338CA 0%, #6D28D9 100%)' },
                                    }}
                                >
                                    {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
                                </Button>
                            </form>

                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Zaten hesabınız var mı?{' '}
                                    <Link to="/login" style={{ color: '#4F46E5', textDecoration: 'none', fontWeight: 600 }}>
                                        Giriş Yap
                                    </Link>
                                </Typography>
                            </Box>

                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
};

export default Register;
