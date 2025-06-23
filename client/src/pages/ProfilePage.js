import React from 'react';
import { Container, Typography, Box, Button, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!user) return <Typography>Нет данных пользователя</Typography>;

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Профиль</Typography>
        <Typography>Email: {user.email}</Typography>
        <Typography>Имя пользователя: {user.username}</Typography>
        <Typography>Роли: {user.roles.map(role => <Chip key={role} label={role} sx={{ mr: 1 }} />)}</Typography>
        <Button variant="contained" color="error" onClick={handleLogout} sx={{ mt: 2 }}>Выйти</Button>
      </Box>
    </Container>
  );
} 