import { QueryInterface, DataTypes } from 'sequelize';


module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('usuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      nombre: {
        allowNull: false,
        type: DataTypes.STRING
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      },
      role: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: "user"
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING
      },
      is_active: {
        allowNull: false,
        type: DataTypes.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('usuarios');
  }
};