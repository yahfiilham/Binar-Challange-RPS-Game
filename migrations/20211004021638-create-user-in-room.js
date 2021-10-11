'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_in_room', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_game_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: 'User_Game',
          key: 'id', 
          as: 'userGameId'
        }
      },
      room_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: 'room',
          key: 'id', 
          as: 'room_id'
        }
      },
      score: {
        type: Sequelize.INTEGER
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_in_room');
  }
};