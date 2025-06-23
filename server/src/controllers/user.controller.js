const db = require('../models');
const User = db.User;
const Role = db.Role;
const bcrypt = require('bcryptjs');

exports.getAll = async (req, res) => {
  try {
    const users = await User.findAll({ include: Role });
    res.json(users);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { include: Role });
    if (!user) return res.status(404).json({ message: 'Пользователь не найден.' });
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

exports.remove = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден.' });
    await user.destroy();
    res.json({ message: 'Пользователь удалён.' });
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

exports.update = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден.' });
    const { email, username, password, roles } = req.body;
    if (email) user.email = email;
    if (username) user.username = username;
    if (password) user.password = await bcrypt.hash(password, 8);
    await user.save();
    if (roles) {
      const roleRecords = await Role.findAll({ where: { name: roles } });
      await user.setRoles(roleRecords);
    }
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
}; 