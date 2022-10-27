'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Event.init({
    app: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    error: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    content_blob: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    content_text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    media_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    encoding: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      allowNull: true
    },
    txid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tx_index: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    txo: {
      type: DataTypes.JSON,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
