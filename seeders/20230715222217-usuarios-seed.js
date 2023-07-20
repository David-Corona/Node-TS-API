'use strict';
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const arrayUsuarios = [
      {
        nombre: 'Test',
        email: 'test@test.com',
        password: '1234',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'David',
        email: 'test@hotmail.com',
        password: '1234',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Admin',
        email: 'corona_121@hotmail.com',
        password: '1234',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const usuario of arrayUsuarios) {
      usuario.password = await bcrypt.hash(usuario.password, 10);
    }

    await queryInterface.bulkInsert('usuarios', arrayUsuarios, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', null, {});
  }
};
