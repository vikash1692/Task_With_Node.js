require('dotenv').config()
const { Sequelize } = require('sequelize');

console.log('Inside Connection',process.env.DATABASE)
const sequelize = new Sequelize(process.env.DATABASE, process.env.DB_USER_NAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    pool:{
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
  });

module.exports = {
    connection : sequelize
}