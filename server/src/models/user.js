import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    provider: {
      type: DataTypes.ENUM('google', 'spotify'),
      allowNull: false
    },
    providerId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return User;
};