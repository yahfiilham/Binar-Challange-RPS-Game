'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('room', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      room_name: {
        type: Sequelize.STRING
      },
      capacity: {
        type: Sequelize.INTEGER
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('room');
  }
};