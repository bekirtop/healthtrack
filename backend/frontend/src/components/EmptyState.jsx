import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import FolderOffIcon from '@mui/icons-material/FolderOff';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { keyframes } from '@mui/system';

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const EmptyState = ({
    icon: Icon = InboxIcon,
    title = 'No data found',
    message = 'There are no items to display yet.',
    action,
    actionLabel,
    variant = 'default' // default, search, folder
}) => {
    const iconMap = {
        default: InboxIcon,
        search: SearchOffIcon,
        folder: FolderOffIcon,
    };

    const FinalIcon = Icon || iconMap[variant];

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="400px"
            py={6}
            px={3}
        >
            <Box
                sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    animation: `${float} 3s ease-in-out infinite`,
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: -10,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
                        zIndex: -1,
                    },
                }}
            >
                <FinalIcon
                    sx={{
                        fontSize: 64,
                        color: 'text.secondary',
                        opacity: 0.5,
                    }}
                />
            </Box>

            <Typography
                variant="h5"
                gutterBottom
                sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 1,
                }}
            >
                {title}
            </Typography>

            <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                sx={{ mb: 3, maxWidth: 400 }}
            >
                {message}
            </Typography>

            {action && actionLabel && (
                <Button
                    variant="contained"
                    onClick={action}
                    sx={{
                        borderRadius: '10px',
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                        boxShadow: '0 4px 16px rgba(79, 70, 229, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #4338CA 0%, #6D28D9 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)',
                        },
                    }}
                >
                    {actionLabel}
                </Button>
            )}
        </Box>
    );
};

export default EmptyState;
