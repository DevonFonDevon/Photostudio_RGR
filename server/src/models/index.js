const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user.model')(sequelize, Sequelize);
db.Role = require('./role.model')(sequelize, Sequelize);
db.Todo = require('./todo.model')(sequelize, Sequelize);
db.RefreshToken = require('./refreshToken.model')(sequelize, Sequelize);

// Связи моделей
// User <-> Role (M:M)
db.User.belongsToMany(db.Role, { through: 'user_roles' });
db.Role.belongsToMany(db.User, { through: 'user_roles' });
// User <-> Todo (M:M)
db.User.belongsToMany(db.Todo, { through: 'user_todos' });
db.Todo.belongsToMany(db.User, { through: 'user_todos' });
// User <-> RefreshToken (1:1)
db.User.hasOne(db.RefreshToken);
db.RefreshToken.belongsTo(db.User);

db.initRoles = async () => {
  const roles = ['user', 'admin'];
  for (const name of roles) {
    await db.Role.findOrCreate({ where: { name } });
  }
};

module.exports = db; 