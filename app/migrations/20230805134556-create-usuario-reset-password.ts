import { QueryInterface, DataTypes } from 'sequelize';


module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('usuarios_reset_password', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false
      },
      expiryDate: { 
        type: DataTypes.DATE
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('usuarios_reset_password');
  }
};