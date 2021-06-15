const { sequelize } = require('../data-access/connection');
const { DataTypes } = require('sequelize');


module.exports = sequelize.define('Group', {
   id: {
        primaryKey: true,
        type: DataTypes.NUMBER,
        autoIncrement:true
   },
   name: {
        type: DataTypes.STRING
   },
   permission: {
        type: DataTypes.ARRAY(DataTypes.STRING)
   },
},{
    tableName:'Group',
    freezeTableName:true,
    timestamps:false
});
