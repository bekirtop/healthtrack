import React from 'react';
import { Card, CardContent, Box, Typography, IconButton } from '@mui/material';
import { keyframes } from '@mui/system';

// Counter animation for numbers
const countUp = keyframes`
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const StatCard = ({
    title,
    value,
    icon: Icon,
    color = 'primary',
    gradient,
    action,
    actionLabel
}) => {
    const gradients = {
        primary: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        secondary: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
        success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        warning: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
        info: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
    };

    return (
        <Card
            sx={{
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
                width: '100%',
                background: gradient || gradients[color],
                color: 'white',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
                    pointerEvents: 'none',
                },
            }}
        >
            <CardContent sx={{ position: 'relative', zIndex: 1, py: 4, px: 3 }}>
                <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(10px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                    >
                        <Icon sx={{ fontSize: 48, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
                    </Box>
                </Box>

                <Typography
                    variant="h2"
                    component="div"
                    sx={{
                        fontWeight: 700,
                        mb: 1,
                        textShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        animation: `${countUp} 0.6s ease-out`,
                    }}
                >
                    {value}
                </Typography>

                <Typography
                    variant="h6"
                    sx={{
                        opacity: 0.95,
                        fontWeight: 600,
                        fontSize: '1.25rem',
                    }}
                >
                    {title}
                </Typography>

                {action && actionLabel && (
                    <Box mt={2}>
                        <Typography
                            component="button"
                            onClick={action}
                            sx={{
                                background: 'rgba(255, 255, 255, 0.25)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '8px',
                                padding: '8px 16px',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                width: '100%',
                                '&:hover': {
                                    background: 'rgba(255, 255, 255, 0.35)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                },
                            }}
                        >
                            {actionLabel}
                        </Typography>
                    </Box>
                )}
            </CardContent>

            {/* Decorative circles */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: -30,
                    right: -30,
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    pointerEvents: 'none',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    pointerEvents: 'none',
                }}
            />
        </Card>
    );
};

export default StatCard;
