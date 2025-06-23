const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const User = db.User;
const Role = db.Role;
const RefreshToken = db.RefreshToken;

const generateToken = (user, roles) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      roles: roles.map(r => r.name)
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRE || '1h' }
  );
};

exports.signup = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ message: 'Заполните все поля.' });
    }
    const candidate = await User.findOne({ where: { [Op.or]: [{ email }, { username }] } });
    if (candidate) {
      return res.status(400).json({ message: 'Пользователь с таким email или username уже существует.' });
    }
    const hashPassword = await bcrypt.hash(password, 8);
    const user = await User.create({ email, username, password: hashPassword });
    // По умолчанию роль user
    const userRole = await Role.findOne({ where: { name: 'user' } });
    await user.addRole(userRole);
    res.status(201).json({ message: 'Пользователь успешно зарегистрирован.' });
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email }, include: Role });
    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден.' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Неверный пароль.' });
    }
    const roles = await user.getRoles();
    const token = generateToken(user, roles);
    // Refresh token
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '1d' });
    await RefreshToken.upsert({ userId: user.id, token: refreshToken, expiryDate: new Date(Date.now() + 1000 * (process.env.REFRESH_TOKEN_EXPIRE || 86400)) });
    res.json({ token, refreshToken, user: { id: user.id, email: user.email, username: user.username, roles: roles.map(r => r.name) } });
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Токен не предоставлен.' });
    const tokenData = await RefreshToken.findOne({ where: { token: refreshToken } });
    if (!tokenData) return res.status(403).json({ message: 'Токен не найден.' });
    if (tokenData.expiryDate < new Date()) {
      await tokenData.destroy();
      return res.status(403).json({ message: 'Токен истёк.' });
    }
    const user = await User.findByPk(tokenData.userId, { include: Role });
    if (!user) return res.status(404).json({ message: 'Пользователь не найден.' });
    const roles = await user.getRoles();
    const newToken = generateToken(user, roles);
    res.json({ token: newToken });
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
}; 