'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      room.hasOne(models.user_in_room, {
        foreignKey: 'room_id',
      });
    }
  };
  room.init({
    room_name: DataTypes.STRING,
    player1_id: DataTypes.INTEGER,
    player2_id: DataTypes.INTEGER,
    uniq_code: DataTypes.STRING,
    hand_choice_player1: DataTypes.ARRAY(DataTypes.STRING),
    hand_choice_player2: DataTypes.ARRAY(DataTypes.STRING),
    result_player1: DataTypes.ARRAY(DataTypes.INTEGER),
    result_player2: DataTypes.ARRAY(DataTypes.INTEGER),
  }, {
    sequelize,
    modelName: 'room',
    timestamps: false,
    freezeTableName: true
  });
  return room;
};