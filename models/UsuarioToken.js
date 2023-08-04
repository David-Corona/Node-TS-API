'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UsuarioToken extends Model {
    static associate(models) {
        UsuarioToken.belongsTo(models.Usuario, { foreignKey: "usuario_id" }); // One-To-One
    }
  }
  UsuarioToken.init({   
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
    },
    createdAt: { 
        type: DataTypes.DATE, 
        defaultValue: new Date()
    }
  }, {
    sequelize, 
    modelName: 'UsuarioToken', 
    tableName: 'usuarios_token',
    timestamps: false // para no añadir createdAt+updatedAt
  });

  return UsuarioToken;
};