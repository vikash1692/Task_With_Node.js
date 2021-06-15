const { sequelize } = require('../data-access/connection');
const { DataTypes } = require('sequelize');

const User = sequelize.define('Module3_User', {
    id: {
        primaryKey: true,
        type: DataTypes.NUMBER,
        autoIncrement:true
    },
    login: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue:false
    },
    age: {
        type: DataTypes.NUMBER
    }
}, {
    freezeTableName: true,
    timestamps:false
})

module.exports = User