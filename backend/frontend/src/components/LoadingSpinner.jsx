import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { keyframes } from '@mui/system';
import FavoriteIcon from '@mui/icons-material/Favorite';

const heartbeat = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.05);
  }
`;

const LoadingSpinner = ({ size = 60, text = 'Loading...' }) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="400px"
            gap={2}
        >
            <Box position="relative">
                {/* Outer gradient circle */}
                <CircularProgress
                    size={size}
                    thickness={4}
                    sx={{
                        color: 'transparent',
                        '& .MuiCircularProgress-circle': {
                            stroke: 'url(#gradient)',
                        },
                    }}
                />
                <svg width={0} height={0}>
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#4F46E5', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#7C3AED', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Healthcare heartbeat icon */}
                <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    sx={{
                        transform: 'translate(-50%, -50%)',
                        animation: `${heartbeat} 1.5s infinite ease-in-out`,
                    }}
                >
                    <FavoriteIcon
                        sx={{
                            fontSize: size / 2,
                            color: '#EF4444',
                            filter: 'drop-shadow(0 2px 8px rgba(239, 68, 68, 0.4))',
                        }}
                    />
                </Box>
            </Box>

            {text && (
                <Box
                    sx={{
                        fontSize: '1rem',
                        fontWeight: 500,
                        color: 'text.secondary',
                        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    {text}
                </Box>
            )}
        </Box>
    );
};

export default LoadingSpinner;
