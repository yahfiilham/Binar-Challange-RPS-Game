'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('User_Game_History', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      total_match: {
        type: Sequelize.INTEGER
      },
      match_won: {
        type: Sequelize.INTEGER
      },
      points: {
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('User_Game_History');
  }
};