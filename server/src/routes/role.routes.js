const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');

// Получить все роли
router.get('/', roleController.getAll);
// Создать роль
router.post('/', roleController.create);

module.exports = router; 