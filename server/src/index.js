const express = require('express');
const cors = require('cors');
const db = require('./models');
require('dotenv').config();
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const roleRoutes = require('./routes/role.routes');
const todoRoutes = require('./routes/todo.routes');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Тестовый маршрут
app.get('/', (req, res) => {
  res.json({ message: 'Добро пожаловать в REST API управления задачами!' });
});

// TODO: Подключить роуты (auth, users, roles, todos)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/todos', todoRoutes);

// Раздача production-сборки React только для не-API маршрутов
app.use(express.static(path.join(__dirname, '../../client/build')));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error('UNCAUGHT ERROR:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 8080;
db.sequelize.sync().then(async () => {
  await db.initRoles();
  app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
  });
}); 