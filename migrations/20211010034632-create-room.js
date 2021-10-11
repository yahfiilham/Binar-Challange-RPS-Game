'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('room', 'result_player1', {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
      }),
      queryInterface.addColumn('room', 'result_player2', {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
      }),
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.removeColumn('room', 'result_player1'),
      queryInterface.removeColumn('room', 'result_player2'),
  ]);
  },
};
