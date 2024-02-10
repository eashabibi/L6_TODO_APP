/* eslint-disable comma-dangle */
/* eslint-disable semi */
/* eslint-disable quotes */
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // add foreign key to Sport model in which adminID in sports table is a foreign key to id in Users table where isAdmin is true
      User.hasMany(models.Sport, { foreignKey: "adminId" });
      User.hasMany(models.Session, { foreignKey: "userId" });
    }

    static async checkAdmin(email) {
      const user = await this.findOne({ where: { email } });
      return { isAdmin: user.isAdmin, adminId: user.id };
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: DataTypes.STRING,
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
