import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, TextField, List, ListItem, ListItemText, IconButton, Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

export default function TodosPage() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  // Загрузка задач
  const fetchTodos = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`/api/todos/user/${user.id}`, { headers: { Authorization: `Bearer ${token}` } });
    setTodos(res.data || []);
  };

  useEffect(() => { fetchTodos(); }, []);

  // Добавление задачи
  const handleAdd = async () => {
    if (!title) return;
    const token = localStorage.getItem('token');
    await axios.post('/api/todos', { title, userIds: [user.id] }, { headers: { Authorization: `Bearer ${token}` } });
    setTitle('');
    fetchTodos();
  };

  // Удаление задачи
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`/api/todos/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchTodos();
  };

  // Редактирование задачи
  const handleEdit = (todo) => {
    setEditId(todo.id);
    setEditTitle(todo.title);
  };

  // Обновление задачи
  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    await axios.put(`/api/todos/${editId}`, { title: editTitle }, { headers: { Authorization: `Bearer ${token}` } });
    setEditId(null);
    setEditTitle('');
    fetchTodos();
  };

  // Переключение статуса задачи
  const handleToggle = async (todo) => {
    const token = localStorage.getItem('token');
    await axios.put(`/api/todos/${todo.id}`, { completed: !todo.completed }, { headers: { Authorization: `Bearer ${token}` } });
    fetchTodos();
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Мои заметки</Typography>
        <Box sx={{ display: 'flex', mb: 2 }}>
          <TextField label="Новая заметка" value={title} onChange={e => setTitle(e.target.value)} fullWidth />
          <Button variant="contained" onClick={handleAdd} sx={{ ml: 2 }}>Добавить</Button>
        </Box>
        <List>
          {todos.map(todo => (
            <ListItem key={todo.id} secondaryAction={
              <>
                <IconButton edge="end" onClick={() => handleEdit(todo)}><EditIcon /></IconButton>
                <IconButton edge="end" onClick={() => handleDelete(todo.id)}><DeleteIcon /></IconButton>
              </>
            }>
              <Checkbox checked={todo.completed} onChange={() => handleToggle(todo)} />
              {editId === todo.id ? (
                <>
                  <TextField value={editTitle} onChange={e => setEditTitle(e.target.value)} size="small" />
                  <Button onClick={handleUpdate}>Сохранить</Button>
                </>
              ) : (
                <ListItemText primary={todo.title} sx={{ textDecoration: todo.completed ? 'line-through' : 'none' }} />
              )}
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
} 