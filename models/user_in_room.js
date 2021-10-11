'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_in_room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user_in_room.belongsTo(models.room, {
				foreignKey: "room_id",
				onDelete: "CASCADE",
			});
    }
  };
  user_in_room.init({
    room_id: DataTypes.INTEGER,
    hand_choice: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'user_in_room',
    timestamps: false,
    freezeTableName: true
  });
  return user_in_room;
};