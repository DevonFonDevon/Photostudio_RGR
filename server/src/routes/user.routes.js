const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Получить всех пользователей
router.get('/', userController.getAll);
// Получить пользователя по id
router.get('/:id', userController.getById);
// Удалить пользователя
router.delete('/:id', userController.remove);
// Обновить пользователя
router.put('/:id', userController.update);

module.exports = router; 