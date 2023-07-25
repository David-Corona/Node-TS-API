'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UsuarioToken extends Model {
    static associate(models) {
        UsuarioToken.belongsTo(models.Usuario, { foreignKey: "usuario_id" });
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
      type: DataTypes.STRING, //TODO type ObjectId ?
      allowNull: false,
    },
    // createdAt: { 
    //     type: DataTypes.DATE, 
    //     default: Date.now, 
    //     expires: 30 * 86400 
    // }
  }, {
    sequelize, 
    modelName: 'UsuarioToken', 
  });

  return UsuarioToken;
};