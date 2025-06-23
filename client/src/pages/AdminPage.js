import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem } from '@mui/material';
import axios from 'axios';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    const res = await axios.get('/api/users', { headers: { Authorization: `Bearer ${token}` } });
    setUsers(res.data);
  };
  const fetchRoles = async () => {
    const res = await axios.get('/api/roles', { headers: { Authorization: `Bearer ${token}` } });
    setRoles(res.data);
  };
  useEffect(() => { fetchUsers(); fetchRoles(); }, []);

  const handleRoleChange = async (userId, newRoles) => {
    await axios.put(`/api/users/${userId}`, { roles: newRoles }, { headers: { Authorization: `Bearer ${token}` } });
    fetchUsers();
  };
  const handleDelete = async (userId) => {
    await axios.delete(`/api/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchUsers();
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Админ-панель</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Имя пользователя</TableCell>
                <TableCell>Роли</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Select
                      multiple
                      value={user.Roles.map(r => r.name)}
                      onChange={e => handleRoleChange(user.id, e.target.value)}
                      size="small"
                    >
                      {roles.map(role => (
                        <MenuItem key={role.id} value={role.name}>{role.name}</MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button color="error" onClick={() => handleDelete(user.id)}>Удалить</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
} 