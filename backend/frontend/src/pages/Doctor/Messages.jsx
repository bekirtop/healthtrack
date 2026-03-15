import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  List,
  ListItem,
  TextField,
  Button,
  Typography,
  Avatar,
  Card,
  useTheme,
  alpha,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MessageIcon from '@mui/icons-material/Message';
import { useAuth } from '../../auth/AuthContext';
import api from '../../api/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const Messages = ({ patientId, patient }) => {
  const theme = useTheme();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [patient.userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      // Message tablosu User ID kullanıyor, patient ID değil
      const response = await api.get(`/Message/list/${patient.userId}`);
      setMessages(response.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      console.log('Sending message with:', {
        senderId: user.userId,
        receiverId: patient.userId,
        content: newMessage
      });

      await api.post('/Message/send', {
        senderId: user.userId,
        receiverId: patient.userId,
        content: newMessage,
      });
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error response:', error.response?.data);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return <LoadingSpinner text="Mesajlar yükleniyor..." />;
  }

  return (
    <Card
      sx={{
        borderRadius: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.05)',
        overflow: 'hidden',
        height: '600px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          background: 'white',
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette.secondary.main, 0.1),
              color: theme.palette.secondary.main,
            }}
          >
            {patient.user?.fullName?.charAt(0) || 'P'}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {patient.user?.fullName || 'Hasta'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Direkt Mesajlar
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Messages Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          p: 3,
          background: '#F9FAFB',
        }}
      >
        <List sx={{ p: 0 }}>
          {messages.length === 0 ? (
            <Box py={6}>
              <EmptyState
                message="Henüz mesaj yok. Sohbeti başlatın!"
                icon={MessageIcon}
              />
            </Box>
          ) : (
            messages.map((message, index) => {
              const isDoctor = message.senderId === user.userId;
              return (
                <ListItem
                  key={message.id || index}
                  sx={{
                    flexDirection: 'column',
                    alignItems: isDoctor ? 'flex-end' : 'flex-start',
                    mb: 2,
                    px: 0,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      flexDirection: isDoctor ? 'row-reverse' : 'row',
                      maxWidth: '75%',
                      gap: 1.5,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: isDoctor
                          ? theme.palette.primary.main
                          : alpha(theme.palette.secondary.main, 0.8),
                        fontSize: '0.875rem',
                      }}
                    >
                      {isDoctor
                        ? user.fullName?.charAt(0) || 'D'
                        : patient.user?.fullName?.charAt(0) || 'P'}
                    </Avatar>
                    <Box>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: isDoctor ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                          bgcolor: isDoctor
                            ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)'
                            : 'white',
                          background: isDoctor
                            ? 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)'
                            : 'white',
                          color: isDoctor ? 'white' : 'text.primary',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        }}
                      >
                        <Typography variant="body2">{message.content}</Typography>
                      </Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5, display: 'block', px: 1 }}
                      >
                        {new Date(message.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          p: 2,
          background: 'white',
          borderTop: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <Box display="flex" gap={2} alignItems="flex-end">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Mesajınızı yazın..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
            multiline
            maxRows={3}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '16px',
                backgroundColor: '#F9FAFB',
                '& fieldset': { border: 'none' },
                '&:hover fieldset': { border: '1px solid #E5E7EB' },
                '&.Mui-focused fieldset': { border: '1px solid #4F46E5' },
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={sending || !newMessage.trim()}
            sx={{
              borderRadius: '14px',
              minWidth: 56,
              minHeight: 56,
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
            }}
          >
            <SendIcon />
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default Messages;