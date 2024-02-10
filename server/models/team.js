"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Team.belongsTo(models.Session, { foreignKey: "sess_id" });
      Team.hasMany(models.Player, { foreignKey: "t_id" });
    }

    static createTeam(t_name, t_size, sess_id) {
      return this.create({
        t_name,
        t_size,
        sess_id,
      });
    }

    static async getTeamsBySessionId(sess_id) {
      return this.findAll({ where: { sess_id } });
    }

    static async getTeamById(id) {
      return this.findByPk(id);
    }
  }
  Team.init(
    {
      t_name: DataTypes.STRING,
      t_size: DataTypes.INTEGER,
      sess_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Team",
    }
  );
  return Team;
};
