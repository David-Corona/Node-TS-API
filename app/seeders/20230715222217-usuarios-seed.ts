import bcrypt from 'bcrypt';
import { QueryInterface } from 'sequelize';


module.exports = {
  async up (queryInterface: QueryInterface) {
    const arrayUsuarios = [
      {
        nombre: 'Test',
        email: 'test@test.com',
        role: 'user',
        password: '123456',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'David',
        email: 'test@hotmail.com',
        role: 'user',
        password: '123456',
        is_active: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Admin',
        email: 'corona_121@hotmail.com',
        role: 'admin',
        password: '123456',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const usuario of arrayUsuarios) {
      usuario.password =  await bcrypt.hash(usuario.password, 10);
    }

    queryInterface.bulkInsert('usuarios', arrayUsuarios, {});
  },

  async down (queryInterface: QueryInterface) {
    queryInterface.bulkDelete('usuarios', {}, {});
  }
};
