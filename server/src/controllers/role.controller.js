const db = require('../models');
const Role = db.Role;

exports.getAll = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Имя роли обязательно.' });
    const [role, created] = await Role.findOrCreate({ where: { name } });
    if (!created) return res.status(400).json({ message: 'Роль уже существует.' });
    res.status(201).json(role);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
}; 