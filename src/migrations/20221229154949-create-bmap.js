'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bmaps', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      txid: {
        type: Sequelize.STRING
      },
      vout: {
        type: Sequelize.NUMBER
      },
      app: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      attributes: {
        type: Sequelize.JSON
      },
      content: {
        type: Sequelize.TEXT
      },
      contentType: {
        type: Sequelize.STRING
      },
      encoding: {
        type: Sequelize.STRING
      },
      author: {
        type: Sequelize.STRING
      },
      signature: {
        type: Sequelize.TEXT
      },
      filename: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bmaps');
  }
};