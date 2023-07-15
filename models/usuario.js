'use strict';
const { Model } = require('sequelize');

// Seq cli: sequelize model:create --name usuario --attributes nombre:string,email:string

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Usuario.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    }, 
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize, // We need to pass the connection instance
    modelName: 'Usuario', // We need to choose the model name
  });
  // const Usuario = sequelize.define('usuario', {
  //   id: DataTypes.INTEGER,
  //   username: DataTypes.STRING,
  //   status: DataTypes.CHAR
  // }, {});
  // Usuario.associate = function(models) {
  //     // associations can be defined here
  // };
  return Usuario;
};