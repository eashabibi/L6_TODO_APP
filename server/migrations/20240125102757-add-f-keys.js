"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addConstraint("Sports", {
      fields: ["adminId"],
      type: "foreign key",
      name: "adminId",
      references: {
        table: "Users",
        field: "id",
      },
    });

    await queryInterface.addConstraint("Sessions", {
      fields: ["userId"],
      type: "foreign key",
      name: "userId",
      references: {
        table: "Users",
        field: "id",
      },
    });

    await queryInterface.addConstraint("Sessions", {
      fields: ["s_id"],
      type: "foreign key",
      name: "s_id",
      references: {
        table: "Sports",
        field: "id",
      },
    });

    await queryInterface.addConstraint("Players", {
      fields: ["t_id"],
      type: "foreign key",
      name: "t_id",
      references: {
        table: "Teams",
        field: "id",
      },
    });

    await queryInterface.addConstraint("Teams", {
      fields: ["sess_id"],
      type: "foreign key",
      name: "sess_id",
      references: {
        table: "Sessions",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
