'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_Game_Biodata extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User_Game_Biodata.belongsTo(models.User_Game, {
				foreignKey: "user_game_id",
				onDelete: "CASCADE",
				// as: "userGame"
			});
    }
  };
  User_Game_Biodata.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    date_of_birth: DataTypes.DATEONLY,
    no_hp: DataTypes.STRING,
    profession: DataTypes.STRING,
    country: DataTypes.STRING,
    image: DataTypes.STRING,
    bio: DataTypes.STRING,
    age: DataTypes.INTEGER,
    education: DataTypes.STRING,
    user_game_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User_Game_Biodata',
    timestamps: false,
    freezeTableName: true,
  });
  return User_Game_Biodata;
};