'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('room', 'hand_choice_player1', {
        type: Sequelize.ARRAY(Sequelize.STRING),
      }),
      queryInterface.addColumn('room', 'hand_choice_player2', {
        type: Sequelize.ARRAY(Sequelize.STRING),
      }),
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.removeColumn('room', 'hand_choice_player1'),
      queryInterface.removeColumn('room', 'hand_choice_player2'),
  ]);
  },
};
