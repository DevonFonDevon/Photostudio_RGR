const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todo.controller');

// Получить все задачи
router.get('/', todoController.getAll);
// Получить задачу по id
router.get('/:id', todoController.getById);
// Создать задачу
router.post('/', todoController.create);
// Обновить задачу
router.put('/:id', todoController.update);
// Удалить задачу
router.delete('/:id', todoController.remove);
// Добавить пользователя к задаче
router.post('/:id/users', todoController.addUserToTodo);
// Получить задачи пользователя
router.get('/user/:userId', todoController.getTodosByUser);

module.exports = router; 