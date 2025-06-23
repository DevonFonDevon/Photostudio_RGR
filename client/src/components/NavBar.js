import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

export default function NavBar() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Заметки</Typography>
        <Box>
          <Button color="inherit" component={Link} to="/todos">Мои заметки</Button>
          <Button color="inherit" component={Link} to="/profile">Профиль</Button>
          {user.roles.includes('admin') && (
            <Button color="inherit" component={Link} to="/admin">Админ</Button>
          )}
          <Button color="inherit" onClick={handleLogout}>Выйти</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
} 