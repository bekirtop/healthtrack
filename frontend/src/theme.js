import { createTheme } from '@mui/material/styles';

// Modern premium healthcare theme
const theme = createTheme({
    palette: {
        primary: {
            main: '#4F46E5', // Indigo
            light: '#7C3AED', // Purple
            dark: '#3730A3',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#14B8A6', // Teal
            light: '#2DD4BF',
            dark: '#0F766E',
            contrastText: '#ffffff',
        },
        success: {
            main: '#10B981', // Green
            light: '#34D399',
            dark: '#059669',
        },
        warning: {
            main: '#F59E0B', // Amber
            light: '#FBBF24',
            dark: '#D97706',
        },
        error: {
            main: '#EF4444', // Red
            light: '#F87171',
            dark: '#DC2626',
        },
        info: {
            main: '#3B82F6', // Blue
            light: '#60A5FA',
            dark: '#2563EB',
        },
        background: {
            default: '#F8FAFC',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1E293B',
            secondary: '#64748B',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 700,
            fontSize: '3rem',
            lineHeight: 1.2,
        },
        h2: {
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 700,
            fontSize: '2.5rem',
            lineHeight: 1.2,
        },
        h3: {
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            fontSize: '2rem',
            lineHeight: 1.3,
        },
        h4: {
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            fontSize: '1.75rem',
            lineHeight: 1.3,
        },
        h5: {
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            fontSize: '1.5rem',
            lineHeight: 1.4,
        },
        h6: {
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            fontSize: '1.25rem',
            lineHeight: 1.4,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    shadows: [
        'none',
        '0 2px 4px rgba(0,0,0,0.05)',
        '0 4px 8px rgba(0,0,0,0.05)',
        '0 8px 16px rgba(0,0,0,0.08)',
        '0 12px 24px rgba(0,0,0,0.1)',
        '0 16px 32px rgba(0,0,0,0.12)',
        '0 20px 40px rgba(0,0,0,0.14)',
        '0 24px 48px rgba(0,0,0,0.16)',
        '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        '0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)',
        '0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.10)',
        '0 15px 25px rgba(0,0,0,0.15), 0 5px 10px rgba(0,0,0,0.05)',
        '0 20px 40px rgba(0,0,0,0.2)',
        '0 2px 8px rgba(79, 70, 229, 0.15)',
        '0 4px 16px rgba(79, 70, 229, 0.2)',
        '0 8px 24px rgba(79, 70, 229, 0.25)',
        '0 12px 32px rgba(79, 70, 229, 0.3)',
        '0 16px 48px rgba(79, 70, 229, 0.35)',
        '0 20px 56px rgba(79, 70, 229, 0.4)',
        '0 24px 64px rgba(79, 70, 229, 0.45)',
        '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        '0 0 0 1px rgba(0, 0, 0, 0.05)',
        '0 0 15px rgba(79, 70, 229, 0.5)',
        '0 0 30px rgba(79, 70, 229, 0.6)',
        '0 0 45px rgba(79, 70, 229, 0.7)',
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: '10px 24px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    boxShadow: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                    },
                },
                contained: {
                    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #4338CA 0%, #6D28D9 100%)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 10,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#7C3AED',
                            },
                        },
                        '&.Mui-focused': {
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderWidth: 2,
                                borderColor: '#4F46E5',
                            },
                        },
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                    color: '#1E293B',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 600,
                },
            },
        },
    },
});

export default theme;
