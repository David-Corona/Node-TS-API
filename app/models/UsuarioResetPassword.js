+'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UsuarioResetPassword extends Model {
    static associate(models) {
      UsuarioResetPassword.belongsTo(models.Usuario, { foreignKey: "usuario_id" }); // One-To-One
    }
  }
  UsuarioResetPassword.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    }, 
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    expiryDate: { 
      type: DataTypes.DATE, 
      //defaultValue: new Date() + //TODO
    },
    createdAt: { 
        type: DataTypes.DATE, 
        defaultValue: new Date()
    }
  }, {
    sequelize,
    modelName: 'UsuarioResetPassword',
    tableName: 'usuarios_reset_password',
    timestamps: false // para no añadir createdAt+updatedAt
  });
  return UsuarioResetPassword;
};