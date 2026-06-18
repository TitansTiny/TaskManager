import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Task extends Model {}

Task.init(
  {
    id:    { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING,  allowNull: false },
    done:  { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { sequelize, modelName: 'Task', tableName: 'tasks' }
);

export default Task;