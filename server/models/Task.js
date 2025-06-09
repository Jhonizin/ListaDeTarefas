const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Task = sequelize.define('Task', {
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Task;