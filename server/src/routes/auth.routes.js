const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Регистрация
router.post('/signup', authController.signup);
// Вход
router.post('/signin', authController.signin);
// Обновление токена
router.post('/refreshtoken', authController.refreshToken);

module.exports = router; 