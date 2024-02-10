"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Player.belongsTo(models.Team, { foreignKey: "t_id" });
    }

    static createPlayer(t_id, p_name) {
      return this.create({
        t_id,
        p_name,
      });
    }

    static async getPlayersByTeamId(t_id) {
      return this.findAll({ where: { t_id } });
    }

    static async checkPlayerExist(t_id, p_name) {
      return this.findOne({ where: { t_id, p_name } });
    }

    static async countPlayersByTeamId(t_id) {
      return this.count({ where: { t_id } });
    }

    static async createGroupOfPlayers(t_id, players) {
      return this.bulkCreate(
        players.map((p) => {
          return {
            t_id,
            p_name: p,
          };
        })
      );
    }
  }
  Player.init(
    {
      t_id: DataTypes.INTEGER,
      p_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Player",
    }
  );
  return Player;
};
