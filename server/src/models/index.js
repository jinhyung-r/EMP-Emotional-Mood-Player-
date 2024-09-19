
import { Sequelize } from 'sequelize';
import config from '../config/index.js';
import User from './user.js';

const sequelize = new Sequelize(config.MYSQL_NAME, config.MYSQL_USER, config.MYSQL_PW, {
  host: config.MYSQL_HOST,
  dialect: 'mysql',
  logging: false, 
});

const db = {
  sequelize,
  Sequelize,
  User: User(sequelize)
};

export { sequelize, Sequelize };
export default db;