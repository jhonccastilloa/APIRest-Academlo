const { DataTypes } = require('sequelize');
const db = require('../database/db');

const Cart = db.define('carts', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  userdId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("active","disable"),
    allowNull: false,
    defaultValue: "active",
  },
});

module.exports = Cart;
