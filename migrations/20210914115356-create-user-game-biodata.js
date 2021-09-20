'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('User_Game_Biodata', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      date_of_birth: {
        type: Sequelize.DATEONLY
      },
      no_hp: {
        type: Sequelize.STRING
      },
      profession: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      bio: {
        type: Sequelize.STRING
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('User_Game_Biodata');
  }
};