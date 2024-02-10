"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // add foreign key to Sport model in which adminID in sports table is a foreign key to id in Users table where isAdmin is true
      Session.belongsTo(models.User, { foreignKey: "userId" });
      Session.belongsTo(models.Sport, { foreignKey: "s_id" });
      Session.hasMany(models.Team, { foreignKey: "sess_id" });
    }

    static createSession(
      sess_name,
      s_id,
      userId,
      date,
      start_time,
      end_time,
      venue
    ) {
      return this.create({
        sess_name,
        s_id,
        userId,
        date,
        start_time,
        end_time,
        venue,
      });
    }

    static async getSessionsBySportId(s_id) {
      return this.findAll({ where: { s_id } });
    }

    static async getSessionByIdandSportId(id, s_id) {
      return this.findOne({ where: { id, s_id } });
    }
  }
  Session.init(
    {
      sess_name: DataTypes.STRING,
      s_id: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      date: DataTypes.DATEONLY,
      start_time: DataTypes.TIME,
      end_time: DataTypes.TIME,
      venue: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Session",
    }
  );
  return Session;
};
