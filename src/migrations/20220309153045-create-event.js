'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      app: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      content: {
        type: Sequelize.JSON,
        allowNull: false
      },
      content_blob: {
        type: Sequelize.BLOB,
        allowNull: true
      },
      content_text: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      media_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      encoding: {
        type: Sequelize.STRING,
        allowNull: false
      },
      author: {
        type: Sequelize.STRING,
        allowNull: true
      },
      txid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tx_index: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      txo: {
        type: Sequelize.JSON,
        allowNull: false
      },
      error: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Events');
  }
};
