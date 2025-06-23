const db = require('../models');
const Todo = db.Todo;
const User = db.User;

exports.getAll = async (req, res) => {
  try {
    const todos = await Todo.findAll({ include: User });
    res.json(todos);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id, { include: User });
    if (!todo) return res.status(404).json({ message: 'Задача не найдена.' });
    res.json(todo);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, completed, userIds } = req.body;
    if (!title) return res.status(400).json({ message: 'Название обязательно.' });
    const todo = await Todo.create({ title, completed: !!completed });
    if (userIds && Array.isArray(userIds)) {
      const users = await User.findAll({ where: { id: userIds } });
      await todo.setUsers(users);
    }
    res.status(201).json(todo);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

exports.update = async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Задача не найдена.' });
    const { title, completed, userIds } = req.body;
    if (title) todo.title = title;
    if (completed !== undefined) todo.completed = completed;
    await todo.save();
    if (userIds && Array.isArray(userIds)) {
      const users = await User.findAll({ where: { id: userIds } });
      await todo.setUsers(users);
    }
    res.json(todo);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

exports.remove = async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Задача не найдена.' });
    await todo.destroy();
    res.json({ message: 'Задача удалена.' });
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

exports.addUserToTodo = async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Задача не найдена.' });
    const { userId } = req.body;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден.' });
    await todo.addUser(user);
    res.json({ message: 'Пользователь добавлен к задаче.' });
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

exports.getTodosByUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId, { include: Todo });
    if (!user) return res.status(404).json({ message: 'Пользователь не найден.' });
    res.json(user.Todos);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
}; 