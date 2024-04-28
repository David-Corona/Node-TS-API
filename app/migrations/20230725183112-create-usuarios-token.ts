import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up (queryInterface: QueryInterface) {

    await queryInterface.createTable('usuarios_token', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      init_vector: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
      },
      expiryDate: { 
        type: DataTypes.DATE, 
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });
  },

  async down (queryInterface: QueryInterface) {
    await queryInterface.dropTable('usuarios_token');
  }
};
