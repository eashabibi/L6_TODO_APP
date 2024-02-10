"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Sport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // add foreign key to Sport model in which adminID in sports table is a foreign key to id in Users table where isAdmin is true
      Sport.belongsTo(models.User, { foreignKey: "adminId" });
      Sport.hasMany(models.Session, { foreignKey: "s_id" });
    }

    static createSport(s_name, adminId) {
      return this.create({ s_name, adminId });
    }

    static async getSports() {
      return this.findAll();
    }

    static async getSportById(id) {
      return this.findOne({ where: { id } });
    }

    static async deleteSport(id) {
      return this.destroy({ where: { id } });
    }
  }
  Sport.init(
    {
      s_name: DataTypes.STRING,
      adminId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Sport",
    }
  );
  return Sport;
};
